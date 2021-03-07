import { global } from "../utils/global";
import { SecretModal } from '../components/secretModal';

console.log('i am here!')

var secretButton = document.querySelector('.secret');
console.log(secretButton);
secretButton.addEventListener('click', function () {
    console.log('open modal: ', this.dataset.product);
    alert('woot woot')
    console.log(global());
    document.getElementById('content').appendChild(SecretModal)
});