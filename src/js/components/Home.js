import { templates, select, settings, classNames } from '../settings.js';

class Home {
    constructor(element) {
        const thisHome = this;
        thisHome.randerHome(element);
        thisHome.linksAction();
    }
    randerHome(element){
        const thisHome = this;
        thisHome.wrapper = element;
        thisHome.wrapper.innerHTML = templates.homeWidget();
    }
    linksAction(){
        const link1 = document.querySelector('.link1')
        const link2 = document.querySelector('.link2')
        link1.addEventListener('click',function(){
            document.querySelector('#home').classList.remove('active')
            document.querySelector("#order").classList.add('active')
        })
        link2.addEventListener('click', function(){
            document.querySelector('#home').classList.remove('active')
            document.querySelector("#booking").classList.add('active')
        })       
    }

}
export default Home;