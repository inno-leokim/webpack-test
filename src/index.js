import 'normalize.css';
// import './index.css';
import styles from './index.css';
import $ from 'jquery';

function component() {
    const element = document.createElement('div');
    element.innerHTML = 'Hello Webpack';

    console.log(styles);
    
    element.className = styles.helloWebpack; // 이 값은 변형된 해시값으로 전달된다.

    return element;
}

document.body.appendChild(component());
console.log($(`.${styles.helloWebpack}`).length);
console.log(`IS_PRODUCTION MODE: ${IS_PRODUCTION}`);