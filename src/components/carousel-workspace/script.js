export default () => {
    $('.workspace__carousel').slick({
        slidesToShow: 1,
        arrows: false,
        dots: false,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 420,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 4
                }
            }
        ]
    });
}