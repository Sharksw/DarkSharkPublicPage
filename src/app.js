import slick from 'slick-carousel';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import Tooltip from 'tooltip.js';
import workspaceCarousel from './components/carousel-workspace/script';
import simpleCarousel from './components/carousel-simple/script';
import carouselCentered from './components/carousel-centered/script';
import fileInputMask from './components/input-file/script';


workspaceCarousel();
simpleCarousel();
carouselCentered();
fileInputMask();


const $navigationLinks = $('.nav__list-link');
const $sections = $($('.js-scroll-to').get().reverse());
const sectionId = {};
const $header = $('.header');
const $hamburger = $('.hamburger');
const $body = $('body');
const $document = $(document);
const $window = $(window);


$navigationLinks.on('click', scrollTo);
$window.on('scroll', throttle(addFixedHeader, 200));
$window.on('scroll', throttle(highlightNavigation, 100));
$window.on('resize', debounce(closeMobileNav, 200));
$hamburger.on('click', function() {
    $(this).toggleClass('is-active');
    $body.toggleClass('nav-is-open');
});


function scrollTo(event) {
    const $this = $(this);
    event.preventDefault();

    if ($body.hasClass('nav-is-open')) {
        $body.removeClass('nav-is-open');
        $hamburger.removeClass('is-active');
    }

    const currentBlock = $this.attr('href');
    const offsetTop = $(currentBlock).offset().top;
    $('html, body').stop().animate({
        scrollTop: offsetTop - 55
    }, 800);
}

function addFixedHeader() {
    if ($(this).scrollTop() > $('.about').offset().top - 56) {
        $header.addClass('is-fixed');
    } else {
        $header.removeClass('is-fixed');
    }
}

function closeMobileNav() {
    if ($(this).width() >= 992)
        $body.removeClass('nav-is-open');
        $hamburger.removeClass('is-active');
}


$sections.each(function() {
    const id = $(this).attr('id');
    sectionId[id] = $('.nav__list-link[href="#' + id + '"]');
});

function highlightNavigation() {
    const scrollPosition = $(window).scrollTop();

    $sections.each(function() {
        const currentSection = $(this);
        const sectionTop = currentSection.offset().top;

        if (scrollPosition >= sectionTop - 55) {
            const id = currentSection.attr('id');
            const $navigationLink = sectionId[id];
            if (!$navigationLink.parent().hasClass('is-active') && $navigationLinks.closest('.nav').hasClass('header__nav')) {
                $navigationLinks.parent().siblings().removeClass('is-active');
                $navigationLink.parent().addClass('is-active');
            }
            return false;
        }

        if (scrollPosition <= $('.about').offset().top - 200) {
            $navigationLinks.parent().siblings().removeClass('is-active');
            return false;
        }

        if (scrollPosition + $window.height() >= $document.height()) {
            $navigationLinks.parent().siblings().removeClass('is-active');
            sectionId['contact'].parent().addClass('is-active');
            return false;
        }
    });
}

// if ($this.closest('.nav').hasClass('header__nav')) {
//     $this.parent().siblings().removeClass('is-active');
//     $this.parent().addClass('is-active');
// }