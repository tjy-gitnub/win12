const desktop={
    methods: {
        metaPressed(){
            console.log("metaPressed");
            if($('#start-menu').hasClass('show')){
                hide_startmenu();
            }
            else{
                $('#start-btn').addClass('show');
                if($('#search-win').hasClass('show')){
                    $('#search-btn').removeClass('show');
                    $('#search-win').removeClass('show');
                    setTimeout(() => {
                        $('#search-win').removeClass('show-begin');
                    }, 200);
                    hide_widgets();
                }
                if($('#widgets').hasClass('show'))hide_widgets();
                $('#start-menu').addClass('show-begin');
                setTimeout(() => {
                    $('#start-menu').addClass('show');
                }, 0);
            }
        }
    },
};
Vue.createApp(desktop).mount("#desktop");