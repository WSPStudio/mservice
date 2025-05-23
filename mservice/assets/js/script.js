(function () {
	'use strict';

	// 
	// 
	// 
	// 
	// Переменные
	const body = document.querySelector('body');
	const html = document.querySelector('html');
	const popup$1 = document.querySelectorAll('.popup');

	const headerTop = document.querySelector('.header') ? document.querySelector('.header') : document.querySelector('head');
	const headerTopFixed = 'header_fixed';
	let fixedElements = document.querySelectorAll('[data-fixed]');
	let stickyObservers = new Map();

	const menuClass = '.header__mobile';
	const menu = document.querySelector(menuClass) ? document.querySelector(menuClass) : document.querySelector('head');
	const menuLink = document.querySelector('.menu-link') ? document.querySelector('.menu-link') : document.querySelector('head');
	const menuActive = 'active';

	const burgerMedia = 1199;
	const bodyOpenModalClass = 'popup-show';

	let windowWidth = window.innerWidth;
	document.querySelector('.container')?.offsetWidth || 0;

	const checkWindowWidth = () => {
		windowWidth = window.innerWidth;
		document.querySelector('.container')?.offsetWidth || 0;
	};

	//
	//  
	//
	//
	// Проверки

	// Проверка на мобильное устройство
	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
	}

	// Проверка на десктоп разрешение 
	function isDesktop() {
		return windowWidth > burgerMedia
	}

	// Проверка поддержки webp 
	function checkWebp() {
		const webP = new Image();
		webP.onload = webP.onerror = function () {
			if (webP.height !== 2) {
				document.querySelectorAll('[style]').forEach(item => {
					const styleAttr = item.getAttribute('style');
					if (styleAttr.indexOf('background-image') === 0) {
						item.setAttribute('style', styleAttr.replace('.webp', '.jpg'));
					}
				});
			}
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

	// Проверка на браузер safari
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	// Проверка есть ли скролл 
	function haveScroll() {
		return document.documentElement.scrollHeight !== document.documentElement.clientHeight
	}

	// Закрытие бургера на десктопе
	function checkBurgerAndMenu() {
		if (isDesktop()) {
			menuLink.classList.remove('active');
			if (menu) {
				menu.classList.remove(menuActive);
				if (!body.classList.contains(bodyOpenModalClass)) {
					body.classList.remove('no-scroll');
				}
			}
		}

		if (html.classList.contains('lg-on')) {
			if (isMobile()) {
				body.style.paddingRight = '0';
			} else {
				body.style.paddingRight = getScrollBarWidth() + 'px';
			}
		}
	}

	// Задержка при вызове функции
	function throttle(fn, delay) {
		let timer;
		return () => {
			clearTimeout(timer);
			timer = setTimeout(() => fn.apply(this, arguments), delay);
		};
	}

	// Закрытие элемента при клике вне него
	function closeOutClick(closedElement, clickedButton, clickedButtonActiveClass, callback) {
		document.addEventListener('click', (e) => {
			const button = document.querySelector(clickedButton);
			const element = document.querySelector(closedElement);
			const withinBoundaries = e.composedPath().includes(element);

			if (!withinBoundaries && button?.classList.contains(clickedButtonActiveClass) && e.target !== button) {
				element.classList.remove('active');
				button.classList.remove(clickedButtonActiveClass);
			}
		});
	}

	// Плавный скролл
	function scrollToSmoothly(pos, time = 400) {
		const currentPos = window.pageYOffset;
		let start = null;
		window.requestAnimationFrame(function step(currentTime) {
			start = !start ? currentTime : start;
			const progress = currentTime - start;
			if (currentPos < pos) {
				window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
			} else {
				window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
			}
			if (progress < time) {
				window.requestAnimationFrame(step);
			} else {
				window.scrollTo(0, pos);
			}
		});
	}

	window.addEventListener('resize', throttle(checkWindowWidth, 100));


	//
	//
	//
	//
	// Позиционирование

	// Отступ элемента от краев страницы
	function offset(el) {
		var rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		return {
			top: rect.top + scrollTop,
			left: rect.left + scrollLeft,
			right: windowWidth - rect.width - (rect.left + scrollLeft),
		}
	}

	// Добавление элементу обертки
	let wrap = (query, tag, wrapContent = false) => {
		let elements;

		let tagName = tag.split('.')[0] || 'div';
		let tagClass = tag.split('.').slice(1);
		tagClass = tagClass.length > 0 ? tagClass : [];

		{
			elements = document.querySelectorAll(query);
		}

		function createWrapElement(item) {
			let newElement = document.createElement(tagName);
			if (tagClass.length) {
				newElement.classList.add(...tagClass);
			}

			if (wrapContent) {
				while (item.firstChild) {
					newElement.appendChild(item.firstChild);
				}
				item.appendChild(newElement);
			} else {
				item.parentElement.insertBefore(newElement, item);
				newElement.appendChild(item);
			}
		}

		if (elements.length) {
			for (let i = 0; i < elements.length; i++) {
				createWrapElement(elements[i]);
			}
		} else {
			if (elements.parentElement) {
				createWrapElement(elements);
			}
		}
	};

	wrap('table', '.table');

	// Изменение ссылок в меню 
	if (!document.querySelector('body').classList.contains('home') && document.querySelector('body').classList.contains('wp')) {
		let menu = document.querySelectorAll('.menu li a');

		for (let i = 0; i < menu.length; i++) {
			if (menu[i].getAttribute('href').indexOf('#') > -1) {
				menu[i].setAttribute('href', '/' + menu[i].getAttribute('href'));
			}
		}
	}

	// Добавление класса loaded после полной загрузки страницы
	function loaded() {
		document.addEventListener('DOMContentLoaded', function () {
			html.classList.add('loaded');
			if (document.querySelector('header')) {
				document.querySelector('header').classList.add('loaded');
			}
			if (haveScroll()) {
				setTimeout(() => {
					html.classList.remove('scrollbar-auto');
				}, 500);
			}
		});
	}

	// Для локалки
	if (window.location.hostname == 'localhost' || window.location.hostname.includes('192.168')) {
		document.querySelectorAll('.logo, .crumbs>li:first-child>a').forEach(logo => {
			logo.setAttribute('href', '/');
		});

		document.querySelectorAll('.menu a').forEach(item => {
			let firstSlash = 0;
			let lastSlash = 0;

			if (item.href.split('/').length - 1 == 4) {
				for (let i = 0; i < item.href.length; i++) {
					if (item.href[i] == '/') {
						if (i > 6 && firstSlash == 0) {
							firstSlash = i;
							continue
						}

						if (i > 6 && lastSlash == 0) {
							lastSlash = i;
						}
					}
				}

				let newLink = '';
				let removeProjectName = '';

				for (let i = 0; i < item.href.length; i++) {
					if (i > firstSlash && i < lastSlash + 1) {
						removeProjectName += item.href[i];
					}
				}

				newLink = item.href.replace(removeProjectName, '');
				item.href = newLink;
			}
		});
	}

	function setHeaderFixedHeight() {
		document.documentElement.style.removeProperty('--headerFixedHeight');
		void headerTop.offsetHeight;
		requestAnimationFrame(() => {
			document.documentElement.style.setProperty(
				'--headerFixedHeight',
				headerTop.offsetHeight + 'px'
			);
		});
	}

	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(setHeaderFixedHeight, 1);
	});

	setHeaderFixedHeight();


	window.addEventListener('scroll', throttle(setHeaderFixedHeight, 50));

	// 
	// 
	// 
	// 
	// Функции для работы со скроллом и скроллбаром

	// Скрытие скроллбара
	function hideScrollbar() {
		// changeScrollbarGutter()

		popup$1.forEach(element => {
			element.style.display = 'none';
		});

		if (haveScroll()) {
			body.classList.add('no-scroll');
			body.classList.add(bodyOpenModalClass);
		}

		changeScrollbarPadding();
	}

	function showScrollbar() {
		if (!menu.classList.contains(menuActive)) {
			body.classList.remove('no-scroll');
		}

		changeScrollbarPadding(false);

		if (haveScroll()) {
			body.classList.add('scrollbar-auto');
			html.classList.add('scrollbar-auto');
		}
	}

	// Ширина скроллбара
	function getScrollBarWidth$1() {
		let div = document.createElement('div');
		div.style.overflowY = 'scroll';
		div.style.width = '50px';
		div.style.height = '50px';
		document.body.append(div);
		let scrollWidth = div.offsetWidth - div.clientWidth;
		div.remove();

		if (haveScroll()) {
			return scrollWidth
		} else {
			return 0
		}
	}

	// Добавление и удаление отступа у body и фиксированных элементов
	function changeScrollbarPadding(add = true) {
		const scrollbarPadding = getScrollBarWidth$1() + 'px';

		fixedElements.forEach(elem => {
			const position = window.getComputedStyle(elem).position;

			if (position === 'sticky') {
				if (add) {
					if (!stickyObservers.has(elem)) {
						const observer = new IntersectionObserver(([entry]) => {
							if (!entry.isIntersecting) {
								elem.style.paddingRight = scrollbarPadding;
							} else {
								elem.style.paddingRight = '0';
							}
						}, {
							threshold: [1]
						});
						observer.observe(elem);
						stickyObservers.set(elem, observer);
					}
				} else {
					elem.style.paddingRight = '0';
					const observer = stickyObservers.get(elem);
					if (observer) {
						observer.unobserve(elem);
						stickyObservers.delete(elem);
					}
				}
			} else {
				elem.style.paddingRight = add ? scrollbarPadding : '0';
			}
		});

		body.style.paddingRight = add ? scrollbarPadding : '0';
	}

	// Добавление прокрутки мышью для горизонтальных блоков
	function scrolling() {
		let dataScrollingBlocks = document.querySelectorAll('[data-scrolling]');

		if (dataScrollingBlocks) {
			dataScrollingBlocks.forEach(element => {
				let isDragging = false;
				let startX;
				let scrollLeft;
				let moved = false;

				element.addEventListener('mousedown', event => {
					isDragging = true;
					moved = false;
					element.classList.add('dragging');
					startX = event.pageX - element.offsetLeft;
					scrollLeft = element.scrollLeft;

					element.querySelectorAll('img, a').forEach(item => item.ondragstart = () => false);
				});

				element.addEventListener('mousemove', event => {
					if (!isDragging) return
					event.preventDefault();
					moved = true;
					const x = event.pageX - element.offsetLeft;
					const walk = x - startX;
					element.scrollLeft = scrollLeft - walk;
				});

				element.addEventListener('mouseup', event => {
					isDragging = false;
					element.classList.remove('dragging');

					element.querySelectorAll('img, a').forEach(item => item.ondragstart = null);

					if (moved) {
						event.preventDefault();
						event.stopPropagation();
					}
				});

				element.addEventListener('mouseleave', () => {
					isDragging = false;
					element.classList.remove('dragging');
					element.querySelectorAll('img, a').forEach(item => item.ondragstart = null);
				});

				element.querySelectorAll('a').forEach(link => {
					link.addEventListener('click', event => {
						if (moved) {
							event.preventDefault();
							event.stopPropagation();
						}
					});
				});
			});
		}
	}

	// Проверка на браузер safari
	if (isSafari) document.documentElement.classList.add('safari');

	// Проверка поддержки webp 
	checkWebp();

	// Закрытие бургера на десктопе
	window.addEventListener('resize', throttle(checkBurgerAndMenu, 100));
	checkBurgerAndMenu();

	// Добавление класса loaded при загрузке страницы
	loaded();

	// Горизонтальный скролл
	scrolling();

	/* 
		================================================
		  
		Бургер
		
		================================================
	*/

	function burger() {
		if (menuLink) {
			let marginTop = 0;
			let isAnimating = false;

			menuLink.addEventListener('click', function (e) {
				if (isAnimating) return
				isAnimating = true;

				marginTop = headerTop.getBoundingClientRect().height + headerTop.getBoundingClientRect().y;
				menuLink.classList.toggle('active');
				menu.style.marginTop = marginTop + 'px';
				menu.classList.toggle(menuActive);

				if (menu.classList.contains(menuActive)) {
					hideScrollbar();
				} else {
					setTimeout(() => {
						showScrollbar();
					}, 400);
				}

				setTimeout(() => {
					isAnimating = false;
				}, 500);
			});

			function checkHeaderOffset() {
				if (isMobile()) {
					changeScrollbarPadding(false);
				} else {
					if (body.classList.contains(bodyOpenModalClass)) {
						changeScrollbarPadding();
					}
				}

				if (isDesktop()) {
					menu.removeAttribute('style');
				} else {
					if (marginTop != headerTop.getBoundingClientRect().height) {
						menu.style.marginTop = headerTop.getBoundingClientRect().height + 'px';
					}
				}
			}

			window.addEventListener('resize', throttle(checkHeaderOffset, 50));
			window.addEventListener('resize', throttle(checkHeaderOffset, 150));

			if (document.querySelector('.header__mobile')) {
				closeOutClick('.header__mobile', '.menu-link', 'active');
			}
		}
	}

	// 
	// 
	// 
	// 
	// Анимации 

	// Плавное появление
	const fadeIn = (el, isItem = false, display, timeout = 400) => {

		let elements = isItem ? el : document.querySelectorAll(el);

		if (elements.length > 0) {
			elements.forEach(element => {
				element.style.opacity = 0;
				element.style.display = 'block';
				element.style.transition = `opacity ${timeout}ms`;
				setTimeout(() => {
					element.style.opacity = 1;
				}, 10);
			});
		} else {
			el.style.opacity = 0;
			el.style.display = 'block';
			el.style.transition = `opacity ${timeout}ms`;
			setTimeout(() => {
				el.style.opacity = 1;
			}, 10);
		}
	};

	// Плавное исчезание
	const fadeOut = (el, isItem = false, timeout = 400) => {
		let elements = isItem ? el : document.querySelectorAll(el);

		if (elements.length > 0) {
			elements.forEach(element => {
				element.style.opacity = 1;
				element.style.transition = `opacity ${timeout}ms`;
				element.style.opacity = 0;
				setTimeout(() => {
					element.style.display = 'none';
				}, timeout);
				setTimeout(() => {
					element.removeAttribute('style');
				}, timeout + 400);
			});
		} else {
			el.style.opacity = 1;
			el.style.transition = `opacity ${timeout}ms`;
			el.style.opacity = 0;
			setTimeout(() => {
				el.style.display = 'none';
			}, timeout);
			setTimeout(() => {
				el.removeAttribute('style');
			}, timeout + 400);
		}
	};

	//
	//
	//
	//
	// Работа с url

	// Получение хэша
	function getHash() {
		return location.hash ? location.hash.replace('#', '') : '';
	}

	// Удаление хэша
	function removeHash() {
		setTimeout(() => {
			history.pushState("", document.title, window.location.pathname + window.location.search);
		}, 100);
	}

	// Очистка input и textarea при закрытии модалки и отправки формы / Удаление классов ошибки
	let inputs = document.querySelectorAll('input, textarea');

	function clearInputs() {
		inputs.forEach(element => {
			element.classList.remove('wpcf7-not-valid', 'error');
		});
	}

	inputs.forEach(input => {
		const parentElement = input.parentElement;
		const submitButton = input.closest('form')?.querySelector('.submit');

		const updateActiveState = () => {
			if (input.type === 'text' || input.type === 'date') {
				parentElement.classList.toggle('active', input.value.length > 0);
			}
		};

		const resetValidation = () => {
			input.setCustomValidity('');
			submitButton.disabled = false;
		};

		input.addEventListener('keyup', updateActiveState);
		input.addEventListener('change', () => {
			input.classList.remove('wpcf7-not-valid');
			updateActiveState();
		});

		input.addEventListener('input', () => {
			// Форматирование чисел
			if (input.getAttribute('data-number')) {
				input.value = input.value.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
			}

			// Валидация email
			if (input.type === 'email') {
				input.value = input.value.replace(/[^0-9a-zA-Zа-яА-ЯёЁ@.-]+/g, '');
			}

			// Валидация имени
			const nameAttr = input.name?.toLowerCase() || '';
			const placeholder = input.placeholder?.toLowerCase() || '';
			const fioKeywords = ['имя', 'фамилия', 'отчество'];
			const isFIO = nameAttr.includes('name') || fioKeywords.some(word => placeholder.includes(word));

			if (isFIO) {
				input.value = input.value.replace(/[^а-яА-ЯёЁa-zA-Z ]/g, '');
				return;
			}
		});

		if (input.type === 'tel' || input.type === 'email') {
			input.addEventListener('input', resetValidation);
		}
	});

	// Проверка формы перед отправкой
	function initFormValidation(form) {
		// Функция для проверки обязательных полей на выбор
		const checkRequiredChoice = () => {
			let requiredChoice = form.querySelectorAll('[data-required-choice]');
			let hasValue = Array.from(requiredChoice).some(input => input.value.trim() !== '' && input.value !== '+7 ');

			requiredChoice.forEach(input => {
				if (!hasValue) {
					input.setAttribute('required', 'true');
				} else {
					input.removeAttribute('required');
				}
			});
		};

		// Проверка при загрузке страницы
		checkRequiredChoice();

		form.addEventListener('submit', (e) => {
			let isValid = true;

			form.querySelectorAll('input[type="tel"]').forEach(input => {
				if (input.value.length < 17 && input.value.length > 3) {
					input.setCustomValidity('Телефон должен содержать 11 цифр');
					input.reportValidity();
					isValid = false;
				} else {
					input.setCustomValidity('');
				}
			});

			// Проверяем обязательные поля на выбор перед отправкой
			checkRequiredChoice();

			if (!isValid || !form.checkValidity()) e.preventDefault();
		});

		// Обновление `required` при вводе
		let requiredChoice = form.querySelectorAll('[data-required-choice]');

		requiredChoice.forEach(input => {
			input.addEventListener('input', checkRequiredChoice);
		});
	}

	document.querySelectorAll('form').forEach(initFormValidation);

	/* 
		================================================
		  
		Попапы
		
		================================================
	*/

	function popup() {
		let popups = document.querySelectorAll('.popup');

		document.querySelectorAll('[data-modal]').forEach(button => {
			button.addEventListener('click', function () {
				let [dataModal, dataTab] = button.getAttribute('data-modal').split('#');

				let popup = document.querySelector(`#${dataModal}`);
				if (!popup) return

				// Удаляем текущий хеш, если он есть
				if (window.location.hash) {
					history.pushState('', document.title, window.location.pathname + window.location.search);
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

					history.pushState(null, '', `#${dataModal}`);

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
			let hash = window.location.hash.replace('#', '');
			if (!hash) return

			let popup = document.querySelector(`.popup[id="${hash}"]`);
			if (popup) {
				hideScrollbar();
				fadeIn(popup, true);
			}
		}

		openPopupFromHash();

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
				history.pushState('', document.title, window.location.pathname + window.location.search);
			}

			clearInputs();

			setTimeout(() => {
				document.querySelectorAll('.scrollbar-auto').forEach(item => {
					item.classList.remove('scrollbar-auto');
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

	/* 
		================================================
		  
		Плавная прокрутка
		
		================================================
	*/

	function scroll() {
		let headerScroll = 0;
		const scrollLinks = document.querySelectorAll('.scroll, .menu a');

		if (scrollLinks.length) {
			scrollLinks.forEach(link => {
				link.addEventListener('click', e => {
					const target = link.hash;

					if (target && target !== '#') {
						const scrollBlock = document.querySelector(target);
						e.preventDefault();

						if (scrollBlock) {
							headerScroll = (window.getComputedStyle(scrollBlock).paddingTop === '0px') ? -40 : 0;

							scrollToSmoothly(
								offset(scrollBlock).top - parseInt(headerTop.clientHeight - headerScroll),
								400
							);

							removeHash();
							menu.classList.remove(menuActive);
							menuLink.classList.remove('active');
							body.classList.remove('no-scroll');
						} else {
							let [baseUrl, hash] = link.href.split('#');
							if (window.location.href !== baseUrl && hash) {
								link.setAttribute('href', `${baseUrl}?link=${hash}`);
								window.location = link.getAttribute('href');
							}
						}
					}
				});
			});
		}

		document.addEventListener('DOMContentLoaded', () => {
			const urlParams = new URLSearchParams(window.location.search);
			const link = urlParams.get('link');

			if (link) {
				const scrollBlock = document.getElementById(link);
				if (scrollBlock) {
					headerScroll = (window.getComputedStyle(scrollBlock).paddingTop === '0px') ? -40 : 0;

					scrollToSmoothly(
						offset(scrollBlock).top - parseInt(headerTop.clientHeight - headerScroll),
						400
					);

					urlParams.delete('link');
					window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
				}
			}
		});
	}

	/* 
		================================================
		  
		Анимация чисел
		
		================================================
	*/

	function numbers() {
		function digitsCountersInit(digitsCountersItems) {
			let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll('[data-digits-counter]');

			if (digitsCounters) {
				digitsCounters.forEach(digitsCounter => {
					// Если элемент уже был активирован, сбрасываем его
					if (digitsCounter.classList.contains('active')) {
						digitsCounter.innerHTML = '0';
					} else {
						digitsCounter.dataset.originalValue = digitsCounter.innerHTML.replace(' ', '').replace(',', '.');
					}

					digitsCounter.style.width = digitsCounter.offsetWidth + 'px';

					if (parseFloat(digitsCounter.innerHTML.replace(',', '.')) % 1 != 0) {
						digitsCounter.setAttribute('data-float', true);
					}

					digitsCountersAnimate(digitsCounter);
				});
			}
		}

		function digitsCountersAnimate(digitsCounter) {
			let startTimestamp = null;
			const duration = parseInt(digitsCounter.dataset.digitsCounter) || 1000;
			const startValue = parseFloat(digitsCounter.dataset.originalValue) || 0;
			const startPosition = 0;

			digitsCounter.classList.add('active');

			const step = (timestamp) => {
				if (!startTimestamp) startTimestamp = timestamp;
				const progress = Math.min((timestamp - startTimestamp) / duration, 1);

				if (digitsCounter.getAttribute('data-float')) {
					digitsCounter.innerHTML = (progress * (startPosition + startValue)).toFixed(1).replace('.', ',');
				} else {
					digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue));
					digitsCounter.innerHTML = digitsCounter.innerHTML.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
				}

				if (progress < 1) {
					window.requestAnimationFrame(step);
				}
			};

			window.requestAnimationFrame(step);

			setTimeout(() => {
				digitsCounter.removeAttribute('style');
			}, duration + 500);
		}

		// digitsCountersInit() // Запуск при скролле 

		let options = {
			threshold: 0.6
		};

		let observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				const targetElement = entry.target;
				const digitsCountersItems = targetElement.querySelectorAll('[data-digits-counter]');

				if (entry.isIntersecting) {
					if (digitsCountersItems.length) {
						digitsCountersInit(digitsCountersItems);
					}
				} else {
					// Сбрасываем активность, чтобы при возврате заново запускался счётчик
					digitsCountersItems.forEach(item => item.classList.remove('active'));
				}
			});
		}, options);

		let sections = document.querySelectorAll('[class*="section"]');

		if (sections.length) {
			sections.forEach(section => observer.observe(section));
		}
	}

	/* 
		================================================
		  
		Карты
		
		================================================
	*/


	function map() {
		let spinner = document.querySelectorAll('.loader');
		let check_if_load = false;

		function loadScript(url, callback) {
			let script = document.createElement("script");
			if (script.readyState) {
				script.onreadystatechange = function () {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						callback();
					}
				};
			} else {
				script.onload = function () {
					callback();
				};
			}

			script.src = url;
			document.getElementsByTagName("head")[0].appendChild(script);
		}

		function initMap() {
			loadScript("https://api-maps.yandex.ru/2.1/?apikey=5b7736c7-611f-40ce-a5a8-b7fd86e6737c&lang=ru_RU&amp;loadByRequire=1", function () {
				ymaps.load(init);
			});
			check_if_load = true;
		}

		if (document.querySelectorAll('.map').length) {
			let observer = new IntersectionObserver(function (entries) {
				if (entries[0]['isIntersecting'] === true) {
					if (!check_if_load) {
						spinner.forEach(element => {
							element.classList.add('is-active');
						});
						if (entries[0]['intersectionRatio'] > 0.2) {
							initMap();
						}
					}
				}
			}, {
				threshold: [0, 0.5, 1]
			});

			observer.observe(document.querySelector('.map'));
		}
	}

	function waitForTilesLoad(layer) {
		return new ymaps.vow.Promise(function (resolve, reject) {
			let tc = getTileContainer(layer), readyAll = true;
			tc.tiles.each(function (tile, number) {
				if (!tile.isReady()) {
					readyAll = false;
				}
			});
			if (readyAll) {
				resolve();
			} else {
				tc.events.once("ready", function () {
					resolve();
				});
			}
		});
	}

	function getTileContainer(layer) {
		for (let k in layer) {
			if (layer.hasOwnProperty(k)) {
				if (layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer || layer[k] instanceof ymaps.layer.tileContainer.DomContainer) {
					return layer[k];
				}
			}
		}
		return null;
	}

	window.waitForTilesLoad = waitForTilesLoad;
	window.getTileContainer = getTileContainer;

	/* 
		================================================
		  
		Фиксированное меню
		
		================================================
	*/

	function fixedMenu() {
		const fixedElementsArray = Array.from(fixedElements);

		let fixedElementsHas = !fixedElementsArray.includes(headerTop);
		if (!headerTop) return;

		const isFixed = isDesktop() && window.scrollY > 180;

		if (isFixed) {
			headerTop.classList.add(headerTopFixed);
			if (fixedElementsHas) fixedElements.push(headerTop);
		} else {
			headerTop.classList.remove(headerTopFixed);
			if (fixedElementsHas) {
				const index = fixedElements.indexOf(headerTop);
				if (index !== -1) {
					fixedElements.splice(index, 1);
				}
			}
		}
	}

	window.addEventListener('scroll', fixedMenu);
	window.addEventListener('resize', fixedMenu);

	burger();
	map();
	numbers();
	popup();
	scroll();
	fixedMenu();

})();
//# sourceMappingURL=script.js.map
