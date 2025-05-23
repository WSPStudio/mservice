import { body, bodyOpenModalClass, menu, menuActive } from "../scripts/core/variables";
import { changeScrollbarPadding, changeScrollbarGutter, hideScrollbar, showScrollbar, getScrollBarWidth } from "../scripts/core/scroll";

/* 
	================================================
	  
	Галереи
	
	================================================
*/

export function gallery() {
	let popupState = false

	document.querySelectorAll('.text-block img:not([src$=svg])').forEach(item => {
		if (!item.closest('[data-gallery]')) {
			item.insertAdjacentHTML(
				'beforebegin',
				`<a href="${item.currentSrc}" data-gallery></a>`
			)
			item.previousElementSibling.appendChild(item)
		}
	});

	let galleries = document.querySelectorAll('[data-gallery]');

	if (galleries.length) {
		galleries.forEach(gallery => {
			if (!gallery.classList.contains('gallery_init')) {
				let selector = false;

				if (gallery.querySelectorAll('[data-gallery-item]').length) {
					selector = '[data-gallery-item]'
				} else if (gallery.classList.contains('swiper-wrapper')) {
					selector = '.swiper-slide>a'
				} else if (gallery.tagName == 'A') {
					selector = false
				} else {
					selector = 'a'
				}

				lightGallery(gallery, {
					plugins: [lgZoom, lgThumbnail],
					licenseKey: '7EC452A9-0CFD441C-BD984C7C-17C8456E',
					speed: 300,
					selector: selector,
					mousewheel: true,
					zoomFromOrigin: false,
					mobileSettings: {
						controls: false,
						showCloseIcon: true,
						download: true,
					},
					subHtmlSelectorRelative: true,
				});

				gallery.classList.add('gallery_init')

				gallery.addEventListener('lgBeforeOpen', () => {
					if (body.classList.contains(bodyOpenModalClass)) {
						popupState = true;
					}

					body.style.paddingRight = getScrollBarWidth() + 'px'
					changeScrollbarPadding(false)
					hideScrollbar()
					changeScrollbarGutter()
				});

				gallery.addEventListener('lgBeforeClose', () => {
					body.classList.remove(bodyOpenModalClass)

					setTimeout(() => {
						if (!menu.classList.contains(menuActive) && !popupState) {
							body.style.paddingRight = '0'
							body.classList.remove('no-scroll')
						}

						showScrollbar()
					}, 400);

				});
			}
		});
	}
}
