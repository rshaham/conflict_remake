#!/usr/bin/env python3
"""
Conflict Remake - Image Pre-Generation Script
==============================================
Batch generates all game images using Gemini API.

Usage:
    python generate_images.py --all              # Generate all images
    python generate_images.py --category weapons # Generate specific category
    python generate_images.py --retry-failed     # Retry failed generations
    python generate_images.py --list             # List all image specs

Environment:
    GOOGLE_API_KEY - Gemini API key (required)

Output:
    public/images/{category}/{id}.png
    public/images/manifest.json
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Optional, List, Dict, Any

import yaml
from PIL import Image
from tqdm import tqdm

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: google-genai package not installed.")
    print("Run: pip install google-genai")
    sys.exit(1)


# ============================================
# Configuration
# ============================================

# Gemini model for image generation
MODEL_NAME = "gemini-3-pro-image-preview"  # Use available model with image capabilities

# Rate limiting
REQUESTS_PER_MINUTE = 10
REQUEST_DELAY = 60.0 / REQUESTS_PER_MINUTE

# Retry configuration
MAX_RETRIES = 3
RETRY_DELAY = 5.0

# Paths relative to script location
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
SPECS_FILE = PROJECT_ROOT / "data" / "image-specs.yaml"
OUTPUT_DIR = PROJECT_ROOT / "public" / "images"
MANIFEST_FILE = OUTPUT_DIR / "manifest.json"


# ============================================
# Data Classes
# ============================================

@dataclass
class ImageSpec:
    """Specification for a single image to generate."""
    id: str
    category: str
    prompt: str
    width: int
    height: int
    style: str
    format: str = "png"
    # Optional metadata
    name: Optional[str] = None
    vendor: Optional[str] = None
    role: Optional[str] = None
    country: Optional[str] = None
    description: Optional[str] = None
    topic: Optional[str] = None
    state: Optional[str] = None


@dataclass
class GenerationResult:
    """Result of an image generation attempt."""
    id: str
    category: str
    success: bool
    output_path: Optional[str] = None
    error: Optional[str] = None
    timestamp: Optional[str] = None
    retries: int = 0


# ============================================
# Specs Loading
# ============================================

def load_specs(specs_file: Path) -> Dict[str, Any]:
    """Load image specifications from YAML file."""
    if not specs_file.exists():
        raise FileNotFoundError(f"Specs file not found: {specs_file}")

    with open(specs_file, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def parse_specs(raw_specs: Dict[str, Any]) -> List[ImageSpec]:
    """Parse raw YAML specs into ImageSpec objects."""
    specs = []
    global_style = raw_specs.get('global_style', {})
    base_style = global_style.get('base', '')

    # Category mappings for parsing
    category_configs = {
        'weapons': {'size_key': 'size', 'items_key': 'items'},
        'leaders': {'size_key': 'size', 'items_key': 'items'},
        'events': {'size_key': 'size', 'items_key': 'items'},
        'news_generic': {'size_key': 'size', 'items_key': 'items'},
        'news_countries': {'size_key': 'size', 'items_key': 'items'},
        'maps': {'size_key': None, 'items_key': 'items'},  # Size per item
        'ui': {'size_key': None, 'items_key': 'items'},    # Size per item
        'icons': {'size_key': 'size', 'items_key': 'items'},
        'endgame': {'size_key': 'size', 'items_key': 'items'},
    }

    for category, config in category_configs.items():
        if category not in raw_specs:
            continue

        cat_data = raw_specs[category]
        cat_style = cat_data.get('style', '')
        cat_format = cat_data.get('format', 'png')

        # Get default size for category
        default_size = cat_data.get('size', {'width': 512, 'height': 512})

        for item in cat_data.get('items', []):
            # Use item-specific size or category default
            item_size = item.get('size', default_size)

            # Combine styles
            full_style = f"{base_style}, {cat_style}"
            full_prompt = f"{item['prompt']}, {full_style}"

            spec = ImageSpec(
                id=item['id'],
                category=category,
                prompt=full_prompt,
                width=item_size['width'],
                height=item_size['height'],
                style=full_style,
                format=cat_format,
                name=item.get('name'),
                vendor=item.get('vendor'),
                role=item.get('role'),
                country=item.get('country'),
                description=item.get('description'),
                topic=item.get('topic'),
                state=item.get('state'),
            )
            specs.append(spec)

    return specs


# ============================================
# Manifest Management
# ============================================

def load_manifest(manifest_file: Path) -> Dict[str, GenerationResult]:
    """Load existing manifest or create empty one."""
    if manifest_file.exists():
        with open(manifest_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return {
                item['id']: GenerationResult(**item)
                for item in data.get('results', [])
            }
    return {}


def save_manifest(manifest_file: Path, results: Dict[str, GenerationResult],
                  specs_count: int):
    """Save manifest with generation results."""
    manifest_file.parent.mkdir(parents=True, exist_ok=True)

    data = {
        'generated_at': datetime.now().isoformat(),
        'total_specs': specs_count,
        'successful': sum(1 for r in results.values() if r.success),
        'failed': sum(1 for r in results.values() if not r.success),
        'results': [asdict(r) for r in results.values()]
    }

    with open(manifest_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


# ============================================
# Image Generation
# ============================================

def create_client(api_key: str):
    """Create a Gemini API client."""
    return genai.Client(api_key=api_key)


def get_aspect_ratio(width: int, height: int) -> str:
    """Convert dimensions to aspect ratio string for Gemini API."""
    ratio = width / height
    if abs(ratio - 1.0) < 0.1:
        return "1:1"
    elif abs(ratio - 16/9) < 0.1:
        return "16:9"
    elif abs(ratio - 4/3) < 0.1:
        return "4:3"
    elif abs(ratio - 3/4) < 0.1:
        return "3:4"
    elif abs(ratio - 9/16) < 0.1:
        return "9:16"
    elif ratio > 1.5:
        return "16:9"  # Wide
    elif ratio < 0.67:
        return "9:16"  # Tall
    else:
        return "4:3"  # Default


def generate_image(spec: ImageSpec, client) -> GenerationResult:
    """Generate a single image using Gemini API."""
    timestamp = datetime.now().isoformat()
    aspect_ratio = get_aspect_ratio(spec.width, spec.height)

    for attempt in range(MAX_RETRIES):
        try:
            # Build the prompt with style guidance
            full_prompt = (
                f"{spec.prompt}. "
                f"Style: professional game asset illustration, {aspect_ratio} aspect ratio."
            )

            # Generate image using new Gemini API
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=[full_prompt],
                config=types.GenerateContentConfig(
                    response_modalities=['IMAGE'],
                )
            )

            # Extract image from response parts
            if response.candidates and len(response.candidates) > 0:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        # Get the raw image data
                        image_data = part.inline_data.data

                        # Save image
                        output_path = OUTPUT_DIR / spec.category / f"{spec.id}.{spec.format}"
                        output_path.parent.mkdir(parents=True, exist_ok=True)

                        # If it's base64 encoded, decode it
                        if isinstance(image_data, str):
                            import base64
                            image_data = base64.b64decode(image_data)

                        with open(output_path, 'wb') as f:
                            f.write(image_data)

                        # Resize to exact dimensions if needed
                        try:
                            img = Image.open(output_path)
                            if img.size != (spec.width, spec.height):
                                img = img.resize((spec.width, spec.height), Image.LANCZOS)
                                img.save(output_path, format='PNG')
                        except Exception:
                            pass  # Keep original if resize fails

                        return GenerationResult(
                            id=spec.id,
                            category=spec.category,
                            success=True,
                            output_path=str(output_path.relative_to(PROJECT_ROOT)),
                            timestamp=timestamp,
                            retries=attempt
                        )

            # If we get here, no image was generated
            raise ValueError("No image data in response")

        except Exception as e:
            error_msg = str(e)
            if attempt < MAX_RETRIES - 1:
                print(f"  Retry {attempt + 1}/{MAX_RETRIES} for {spec.id}: {error_msg}")
                time.sleep(RETRY_DELAY)
            else:
                return GenerationResult(
                    id=spec.id,
                    category=spec.category,
                    success=False,
                    error=error_msg,
                    timestamp=timestamp,
                    retries=attempt
                )

    # Should not reach here
    return GenerationResult(
        id=spec.id,
        category=spec.category,
        success=False,
        error="Max retries exceeded",
        timestamp=timestamp,
        retries=MAX_RETRIES
    )


def generate_placeholder(spec: ImageSpec) -> GenerationResult:
    """Generate a placeholder image when API is unavailable."""
    timestamp = datetime.now().isoformat()

    try:
        # Create a simple placeholder image
        img = Image.new('RGB', (spec.width, spec.height), color='#E8E8E0')

        # Add text overlay using PIL
        from PIL import ImageDraw, ImageFont
        draw = ImageDraw.Draw(img)

        # Draw category and ID
        text = f"{spec.category}\n{spec.id}"

        # Use default font (may not be very visible, but works)
        try:
            font = ImageFont.truetype("arial.ttf", 20)
        except:
            font = ImageFont.load_default()

        # Center text
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (spec.width - text_width) // 2
        y = (spec.height - text_height) // 2

        draw.text((x, y), text, fill='#666666', font=font)

        # Draw border
        draw.rectangle([(0, 0), (spec.width-1, spec.height-1)], outline='#333333', width=2)

        # Save
        output_path = OUTPUT_DIR / spec.category / f"{spec.id}.{spec.format}"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_path, format='PNG')

        return GenerationResult(
            id=spec.id,
            category=spec.category,
            success=True,
            output_path=str(output_path.relative_to(PROJECT_ROOT)),
            timestamp=timestamp,
            retries=0
        )

    except Exception as e:
        return GenerationResult(
            id=spec.id,
            category=spec.category,
            success=False,
            error=str(e),
            timestamp=timestamp,
            retries=0
        )


# ============================================
# Main Functions
# ============================================

def generate_all(specs: List[ImageSpec], api_key: Optional[str],
                 use_placeholders: bool = False) -> Dict[str, GenerationResult]:
    """Generate all images from specs."""
    results = load_manifest(MANIFEST_FILE)

    if api_key and not use_placeholders:
        client = create_client(api_key)
    else:
        client = None
        if not use_placeholders:
            print("Warning: No API key provided. Generating placeholders only.")
            use_placeholders = True

    print(f"\nGenerating {len(specs)} images...")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Mode: {'Placeholders' if use_placeholders else 'Gemini API'}")
    print()

    for spec in tqdm(specs, desc="Generating"):
        # Skip if already successfully generated
        if spec.id in results and results[spec.id].success:
            continue

        if use_placeholders:
            result = generate_placeholder(spec)
        else:
            result = generate_image(spec, client)
            time.sleep(REQUEST_DELAY)  # Rate limiting

        results[spec.id] = result

        # Save manifest after each generation
        save_manifest(MANIFEST_FILE, results, len(specs))

    return results


def generate_category(specs: List[ImageSpec], category: str,
                      api_key: Optional[str], use_placeholders: bool = False) -> Dict[str, GenerationResult]:
    """Generate images for a specific category."""
    filtered = [s for s in specs if s.category == category]

    if not filtered:
        print(f"No specs found for category: {category}")
        print(f"Available categories: {set(s.category for s in specs)}")
        return {}

    print(f"Found {len(filtered)} images in category '{category}'")
    return generate_all(filtered, api_key, use_placeholders)


def retry_failed(specs: List[ImageSpec], api_key: Optional[str],
                 use_placeholders: bool = False) -> Dict[str, GenerationResult]:
    """Retry only failed generations."""
    results = load_manifest(MANIFEST_FILE)
    failed_ids = {r.id for r in results.values() if not r.success}

    if not failed_ids:
        print("No failed generations to retry.")
        return results

    filtered = [s for s in specs if s.id in failed_ids]
    print(f"Retrying {len(filtered)} failed generations...")

    return generate_all(filtered, api_key, use_placeholders)


def list_specs(specs: List[ImageSpec]):
    """Print summary of all image specs."""
    categories = {}
    for spec in specs:
        if spec.category not in categories:
            categories[spec.category] = []
        categories[spec.category].append(spec)

    print(f"\nTotal images: {len(specs)}")
    print("=" * 50)

    for category, items in sorted(categories.items()):
        print(f"\n{category.upper()} ({len(items)} images)")
        print("-" * 40)
        for item in items:
            print(f"  {item.id}: {item.width}x{item.height}")


def print_status():
    """Print current generation status from manifest."""
    if not MANIFEST_FILE.exists():
        print("No manifest found. Run generation first.")
        return

    with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"\nGeneration Status")
    print("=" * 50)
    print(f"Last run: {data.get('generated_at', 'Unknown')}")
    print(f"Total specs: {data.get('total_specs', 0)}")
    print(f"Successful: {data.get('successful', 0)}")
    print(f"Failed: {data.get('failed', 0)}")

    failed = [r for r in data.get('results', []) if not r.get('success')]
    if failed:
        print(f"\nFailed images:")
        for r in failed:
            print(f"  {r['id']}: {r.get('error', 'Unknown error')}")


# ============================================
# CLI
# ============================================

def main():
    parser = argparse.ArgumentParser(
        description="Generate game images using Gemini API"
    )
    parser.add_argument(
        '--all', action='store_true',
        help="Generate all images"
    )
    parser.add_argument(
        '--category', type=str,
        help="Generate images for specific category"
    )
    parser.add_argument(
        '--retry-failed', action='store_true',
        help="Retry only failed generations"
    )
    parser.add_argument(
        '--list', action='store_true',
        help="List all image specifications"
    )
    parser.add_argument(
        '--status', action='store_true',
        help="Show generation status"
    )
    parser.add_argument(
        '--placeholders', action='store_true',
        help="Generate placeholder images only (no API calls)"
    )
    parser.add_argument(
        '--api-key', type=str,
        help="Gemini API key (or set GOOGLE_API_KEY env var)"
    )

    args = parser.parse_args()

    # Get API key
    api_key = args.api_key or os.environ.get('GOOGLE_API_KEY')

    # Load specs
    try:
        raw_specs = load_specs(SPECS_FILE)
        specs = parse_specs(raw_specs)
    except Exception as e:
        print(f"Error loading specs: {e}")
        sys.exit(1)

    # Execute command
    if args.list:
        list_specs(specs)
    elif args.status:
        print_status()
    elif args.all:
        results = generate_all(specs, api_key, args.placeholders)
        successful = sum(1 for r in results.values() if r.success)
        print(f"\nCompleted: {successful}/{len(specs)} images generated successfully")
    elif args.category:
        results = generate_category(specs, args.category, api_key, args.placeholders)
        successful = sum(1 for r in results.values() if r.success)
        print(f"\nCompleted: {successful} images generated successfully")
    elif args.retry_failed:
        results = retry_failed(specs, api_key, args.placeholders)
        successful = sum(1 for r in results.values() if r.success)
        print(f"\nCompleted: {successful} images now successful")
    else:
        parser.print_help()
        print("\nExample usage:")
        print("  python generate_images.py --all --placeholders")
        print("  python generate_images.py --category weapons --api-key YOUR_KEY")
        print("  python generate_images.py --status")


if __name__ == "__main__":
    main()
