[简体中文](README.zh_CN.md)

# HSAS 2048
A HSAS version of Gabriele Cirulli's [original 2048](http://gabrielecirulli.github.io/2048/). This version is a clone of afrancocf's [2048-OPTIMUSJR](https://github.com/afrancocf/2048-OPTIMUSJR). 

The original version is a small clone of [1024](https://play.google.com/store/apps/details?id=com.veewo.a1024), based on [Saming's 2048](http://saming.fr/p/2048/) (also a clone).

### Notes for the HSAS version
This version is just made for fun. We HIGHLY respect all the teachers. The order of teachers is arranged solely according to the official website of the school, without any personal subjective intention. There is no improper guidance. Students should respect and honor their teachers. You can [fork the original repo as well](https://github.com/gabrielecirulli/2048)

## License
2048 is licensed under the [MIT license.](https://github.com/alittleyoshi/HSAS-2048-images-ver/blob/master/LICENSE.txt)

## Donations
Gabriele made this in his spare time, and it's hosted on GitHub (which means I don't have any hosting costs), but if you enjoyed the game and feel like buying him coffee, you can donate at his BTC address: `1Ec6onfsQmoP9kkL3zkpB6c5sA4PVcXU2i`.

## 2026 remastered edition

Interface and interaction design by **Codex · GPT-6**. The original school logo,
`#c96152` theme color, all eleven teacher images, image order, scoring, random
2/4 spawn probabilities, and classic 4×4 gameplay are preserved.

Added a responsive warm-paper interface, teacher gallery, current-level progress,
one-move undo (U), optional numeric labels, restart confirmation, keyboard-accessible
help, reduced-motion support, and resilient browser-local saves. Arrow keys, WASD,
and pointer swipes work. Original authors and acknowledgements remain in the footer.
The school imagery is credited to the original project / school; this remains a fan-made game.

No build step or third-party runtime dependencies are required. GitHub Pages serves
`index.html` directly. Legacy CSS/SCSS remain as historical sources; the active
stylesheet is `style/remaster.css`. The obsolete application-cache manifest is no
longer enabled, and all game assets are local HTTPS-compatible paths.

### Development

- `npm start` — preview at http://127.0.0.1:4173 (Node.js 18+).
- `npm test` — gameplay, undo, persistence, win/continue, and storage recovery tests.
- `screenshots/` — desktop, mobile, and help-dialog captures from browser verification.

Saves reuse the original `gameState` and `bestScore` keys for compatibility.
Numeric labels use `hsasNumbers`. Undo is available for the latest valid move in
this session; refreshing clears the undo snapshot. No analytics or remote fonts.

### Classic edition

`classic.html` preserves the original layout and teacher-image game from commit `bf79b3d`. Both editions have reciprocal navigation. Classic scripts live in `classic/js/`; existing images and the original stylesheet are shared. Compatibility fixes remove obsolete appcache/remote font markup and correct win-continuation and asset URLs. Classic saves use `hsasClassicGameState` and `hsasClassicBestScore`, so switching editions does not overwrite either game.
