// ============================================
// Game Image Component - Base Image Component
// ============================================
// Displays game images with fallback logic.
// Supports pre-generated images and optional runtime generation.

import { useState, useEffect } from 'react';
import { generateImage, type ImageResult } from '../../ai';

// ============================================
// Types
// ============================================

interface GameImageProps {
  /** Source path for pre-generated image */
  src?: string;
  /** AI prompt for runtime generation (if src unavailable) */
  prompt?: string;
  /** Alt text for accessibility */
  alt: string;
  /** CSS class for styling */
  className?: string;
  /** Width of the image */
  width?: number;
  /** Height of the image */
  height?: number;
  /** Style hint for AI generation */
  style?: string;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
  /** Show loading placeholder */
  showLoading?: boolean;
  /** Custom fallback component or URL */
  fallback?: React.ReactNode | string;
  /** Apply retro border styling */
  retroBorder?: boolean;
}

// ============================================
// Component
// ============================================

export function GameImage({
  src,
  prompt,
  alt,
  className = '',
  width,
  height,
  style,
  onLoad,
  onError,
  showLoading = true,
  fallback,
  retroBorder = false,
}: GameImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(src || null);
  const [loading, setLoading] = useState(!src);
  const [error, setError] = useState(false);

  // Try to load/generate image
  useEffect(() => {
    // If we have a direct src, use it
    if (src) {
      setImageUrl(src);
      setLoading(false);
      return;
    }

    // If we have a prompt, try AI generation
    if (prompt) {
      setLoading(true);
      setError(false);

      generateImage(prompt, { width, height, style })
        .then((result: ImageResult) => {
          setImageUrl(result.url);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [src, prompt, width, height, style]);

  // Handle image load error
  const handleError = () => {
    setError(true);
    onError?.();
  };

  // Handle successful load
  const handleLoad = () => {
    onLoad?.();
  };

  // Build container classes
  const containerClasses = [
    'relative overflow-hidden',
    retroBorder ? 'border-2 border-black retro-shadow' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Render loading state
  if (loading && showLoading) {
    return (
      <div
        className={containerClasses}
        style={{ width, height }}
        role="img"
        aria-label={`Loading: ${alt}`}
      >
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="font-mono text-[10px] text-gray-500">LOADING...</span>
        </div>
      </div>
    );
  }

  // Render error/fallback state
  if (error || !imageUrl) {
    // Custom fallback
    if (fallback) {
      if (typeof fallback === 'string') {
        return (
          <img
            src={fallback}
            alt={alt}
            className={containerClasses}
            width={width}
            height={height}
            onLoad={handleLoad}
          />
        );
      }
      return <>{fallback}</>;
    }

    // Default placeholder
    return (
      <div
        className={containerClasses}
        style={{
          width,
          height,
          backgroundColor: '#E8E8E0',
        }}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-2">
            <span className="font-mono text-[10px] text-gray-500 uppercase block">
              {alt}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render image
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={containerClasses}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}

// ============================================
// Specialized Components
// ============================================

interface WeaponImageProps {
  weaponId: string;
  weaponName: string;
  className?: string;
  showBorder?: boolean;
}

/**
 * Weapon image with automatic path resolution
 */
export function WeaponImage({
  weaponId,
  weaponName,
  className = '',
  showBorder = true,
}: WeaponImageProps) {
  return (
    <GameImage
      src={`/images/weapons/${weaponId}.png`}
      alt={weaponName}
      className={className}
      width={512}
      height={256}
      retroBorder={showBorder}
      fallback={
        <div
          className={`bg-gray-100 border-2 border-gray-300 flex items-center justify-center ${className}`}
          style={{ width: 512, height: 256 }}
        >
          <span className="font-mono text-sm text-gray-500">{weaponName}</span>
        </div>
      }
    />
  );
}

interface LeaderPortraitProps {
  leaderId: string;
  leaderName: string;
  countryId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Leader portrait with automatic path resolution
 */
export function LeaderPortrait({
  leaderId,
  leaderName,
  countryId,
  className = '',
  size = 'md',
}: LeaderPortraitProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const sizePixels = {
    sm: 48,
    md: 64,
    lg: 96,
  };

  return (
    <GameImage
      src={`/images/leaders/${leaderId}.png`}
      alt={leaderName}
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      width={sizePixels[size]}
      height={sizePixels[size]}
      retroBorder={false}
      fallback={
        <div
          className={`rounded-full bg-gray-300 flex items-center justify-center ${sizeClasses[size]} ${className}`}
        >
          <span className="font-mono text-xl">
            {countryId ? countryId.slice(0, 2).toUpperCase() : '??'}
          </span>
        </div>
      }
    />
  );
}

interface EventHeaderProps {
  category: string;
  className?: string;
}

/**
 * Event header banner
 */
export function EventHeader({ category, className = '' }: EventHeaderProps) {
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '_');

  return (
    <GameImage
      src={`/images/events/event_${normalizedCategory}.png`}
      alt={`${category} Event`}
      className={`w-full ${className}`}
      width={800}
      height={300}
      retroBorder
      fallback={
        <div
          className={`w-full h-32 bg-gray-200 border-2 border-black flex items-center justify-center ${className}`}
        >
          <span className="font-pixel text-xl text-gray-500 uppercase">
            {category}
          </span>
        </div>
      }
    />
  );
}

interface NewsImageProps {
  topic: string;
  countryId?: string;
  className?: string;
}

/**
 * News illustration image
 */
export function NewsImage({ topic, countryId, className = '' }: NewsImageProps) {
  // Determine the image path
  const imagePath = countryId
    ? `/images/news/news_${countryId}.png`
    : `/images/news/news_${topic.toLowerCase().replace(/\s+/g, '_')}.png`;

  return (
    <GameImage
      src={imagePath}
      alt={`News: ${topic}`}
      className={className}
      width={400}
      height={300}
      retroBorder
      fallback={
        <div
          className={`bg-gray-100 border-2 border-black flex items-center justify-center ${className}`}
          style={{ width: 400, height: 300 }}
        >
          <span className="font-mono text-xs text-gray-500 uppercase">{topic}</span>
        </div>
      }
    />
  );
}

interface EndgameImageProps {
  condition: string;
  className?: string;
}

/**
 * Endgame state image
 */
export function EndgameImage({ condition, className = '' }: EndgameImageProps) {
  const imagePath = `/images/endgame/endgame_${condition.toLowerCase().replace(/\s+/g, '_')}.png`;

  return (
    <GameImage
      src={imagePath}
      alt={`Game Over: ${condition}`}
      className={`w-full ${className}`}
      width={600}
      height={400}
      retroBorder
    />
  );
}
