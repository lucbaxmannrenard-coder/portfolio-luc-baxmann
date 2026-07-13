#!/bin/bash
# Encode rendered Veo legs for smooth scroll-scrubbing + webp posters.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="$HERE/work"
ASSETS="$HERE/../site/assets"
mkdir -p "$ASSETS/vid"
NAMES="intro web automation epi accede contact"

enc() { ffmpeg -v error -y -i "$1" -an -vf "unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$2"; echo "enc $2 $(du -h "$2" | cut -f1)"; }

for n in $NAMES; do
  [ -f "$WORK/dive_$n.mp4" ] && enc "$WORK/dive_$n.mp4" "$ASSETS/vid/$n.mp4"
done

# Mobile variants (clipMobile): 720p + GOP 4. Phone decoders pay per frame-from-
# keyframe on every seek, so the tighter GOP scrubs far smoother than the 1080p
# master; crf 22 keeps the files light enough for cellular.
encm() { ffmpeg -v error -y -i "$1" -an -vf "scale=-2:720,unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p \
  -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$2"; echo "encm $2 $(du -h "$2" | cut -f1)"; }

for n in $NAMES; do
  [ -f "$WORK/dive_$n.mp4" ] && encm "$WORK/dive_$n.mp4" "$ASSETS/vid/$n-m.mp4"
done

# Posters: scene 1 uses its still; later scenes use the actual first frame of their leg
# (arch A renders differ from the stills, and the poster must match the video's frame 0).
ffmpeg -v error -y -i "$WORK/still_intro.png" -vf scale=1800:-2 -q:v 3 "$ASSETS/intro.jpg"
prev=""
for n in $NAMES; do
  if [ -n "$prev" ] && [ -f "$WORK/dive_$n.mp4" ]; then
    ffmpeg -v error -y -i "$WORK/dive_$n.mp4" -frames:v 1 -vf scale=1800:-2 -q:v 3 "$ASSETS/$n.jpg"
  fi
  prev="$n"
done
echo done
