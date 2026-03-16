# Known Issues

## Mobile (iOS Safari) — Unmute required despite user gesture

On mobile in playlist/audio mode, the user taps a track (genuine play gesture), yet the Vimeo player still shows its native "unmute" button requiring a second tap.

**What we're doing:**
- `autoplay: true`, `muted: false` in the Vimeo Player constructor
- `playsinline: true` to keep iOS from hijacking into native player
- `setVolume(1)` called from direct tap handlers
- The video container is made visible BEFORE the player is created so iOS sees a visible element

**Why it still happens:**
- Vimeo's iframe is cross-origin — iOS Safari does not propagate user gesture context across the cross-origin postMessage boundary
- The Vimeo SDK communicates with the iframe via postMessage, so by the time `play()` or `setVolume(1)` reaches the actual `<video>` element inside the iframe, iOS no longer considers it a user-initiated action
- This is a known limitation of iOS Safari's autoplay policy for cross-origin iframes (not specific to our code)
- `autoplay: true` is set correctly — the user IS providing a genuine play gesture — but iOS doesn't trust it because it crosses the iframe origin boundary

**Vimeo SDK known issues:**
- `setCurrentTime()` fails silently on iOS Safari (https://github.com/vimeo/player.js/issues/117)
- `setCurrentTime` doesn't autoplay on iOS (https://github.com/vimeo/player.js/issues/284)
- Autoplay throws `NotAllowedError` on iOS webkit (https://github.com/vimeo/player.js/issues/1037)

**Possible future fixes:**
- Vimeo adding `allow="autoplay"` support to their iframe embed
- A future iOS Safari update relaxing cross-origin gesture propagation
- Using Vimeo's native SDK (not iframe-based) which would keep everything same-origin
