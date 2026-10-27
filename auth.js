
const dots = [...document.querySelectorAll('#pin i')],
      keypad = document.querySelector('#keypad'),
      message = document.querySelector('#message');

let pin = '';

function paint() {
  dots.forEach((d, i) => d.classList.toggle('on', i < pin.length));
  message.textContent = pin.length ? `${pin.length} / 7` : '7 digits';
}

function submit() {
  if (pin === SITE_CONFIG.passcode) {
    sessionStorage.setItem('birthdayUnlocked', 'yes');

    document.querySelector('.login-stage').classList.add('success');

    setTimeout(() => {
      location.href = 'intro.html';
    }, 700);
  } else {
    message.textContent = 'not quite…';
    message.className = 'message error';

    pin = '';
    paint();

    setTimeout(() => {
      message.className = 'message';
    }, 900);
  }
}

keypad.onclick = e => {
  const b = e.target.closest('button');
  if (!b) return;

  const k = b.dataset.k;

  if (k === 'clear') {
    pin = pin.slice(0, -1);
  } 
  else if (k === 'enter') {
    submit();
  } 
  else if (pin.length < 7) {
    pin += k;
  }

  paint();

  // Automatically check when 7 digits are entered
  if (pin.length === 7) {
    setTimeout(submit, 160);
  }
};

paint();
