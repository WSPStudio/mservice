import { body, bodyOpenModalClass } from "../scripts/core/variables";
import { hideScrollbar, showScrollbar } from "../scripts/other/scroll";
import { fadeIn, fadeOut } from "../scripts/other/animation";
import { removeHash, getHash } from "../scripts/other/url"
import { clearInputs } from "../scripts/forms/validation";

/* 
	================================================
	  
	Попапы
	
	================================================
*/

export function popup() {
	let popups = document.querySelectorAll('.popup');

	document.querySelectorAll('[data-modal]').forEach(button => {
		button.addEventListener('click', function () {
			let [dataModal, dataTab] = button.getAttribute('data-modal').split('#');

			let popup = document.querySelector(`#${dataModal}`)
			if (!popup) return

			// Удаляем текущий хеш, если он есть
			if (window.location.hash) {
				history.pushState('', document.title, window.location.pathname + window.location.search)
			}

			if (popup) {
				// Удалить хеш текущего попапа
				if (getHash()) {
					history.pushState("", document.title, (window.location.pathname + window.location.search).replace(getHash(), ''));
				}

				hideScrollbar();

				// Добавить хеш нового попапа
				if (!window.location.hash.includes(dataModal)) {
					window.location.hash = dataModal;
				}

				fadeIn(popup, true);

				history.pushState(null, '', `#${dataModal}`)

				// открыть таб в попапе
				if (dataTab) {
					document.querySelector(`[data-href="#${dataTab}"]`).click();
				}
			}
		});
	});

	// Открытие модалки по хешу 
	popups.forEach(popup => {
		if (window.location.hash === `#${popup.getAttribute('id')}`) {
			hideScrollbar();
			fadeIn(`.popup[id="${popup.getAttribute('id')}"]`);
		}
	});

	// Открытие по хешу при загрузке страницы
	function openPopupFromHash() {
		let hash = window.location.hash.replace('#', '')
		if (!hash) return

		let popup = document.querySelector(`.popup[id="${hash}"]`)
		if (popup) {
			hideScrollbar()
			fadeIn(popup, true)
		}
	}

	openPopupFromHash()

	// 
	// 
	// Закрытие модалок

	function closeModal(removeHashFlag = true) {
		fadeOut('.popup');
		document.querySelectorAll('[data-modal]').forEach(button => button.disabled = true);
		body.classList.remove(bodyOpenModalClass);

		setTimeout(() => {
			let modalInfo = document.querySelector('.modal-info');
			if (modalInfo) {
				modalInfo.value = '';
			}

			showScrollbar();
			document.querySelectorAll('[data-modal]').forEach(button => button.disabled = false);
		}, 400);

		if (removeHashFlag) {
			history.pushState('', document.title, window.location.pathname + window.location.search)
		}

		clearInputs();

		setTimeout(() => {
			document.querySelectorAll('.scrollbar-auto').forEach(item => {
				item.classList.remove('scrollbar-auto')
			});
		}, 500);
	}

	// Закрытие модалки при клике на крестик
	document.querySelectorAll('[data-popup-close]').forEach(element => {
		element.addEventListener('click', closeModal);
	});

	// Закрытие модалки при клике вне области контента
	let popupDialog = document.querySelectorAll('.popup__dialog');

	window.addEventListener('click', function (e) {
		popupDialog.forEach(popup => {
			if (e.target === popup) {
				closeModal();
			}
		});
	});

	// Закрытие модалки при клике ESC
	window.onkeydown = function (event) {
		if (event.key === 'Escape' && document.querySelectorAll('.lg-show').length === 0) {
			closeModal();
		}
	};

	// Навигация назад/вперёд
	// window.addEventListener('popstate', () => {
	// 	let hash = window.location.hash.replace('#', '')

	// 	if (hash) {
	// 		let popup = document.querySelector(`.popup[id="${hash}"]`)
	// 		if (popup) {
	// 			hideScrollbar()
	// 			fadeIn(popup, true)
	// 		}
	// 	} else {
	// 		closeModal(false)
	// 	}
	// })
}
