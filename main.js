const { MuseClient, channelNames } = require('muse-js');
const { Observable } = require('rxjs/Observable');
require('rxjs/add/observable/timer');
require('rxjs/add/observable/of');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/distinctUntilChanged');

const eye = document.querySelector('.eye');

let client = new MuseClient();
async function connect() {
  await client.connect();
  await client.start();
  const leftEye = channelNames.indexOf('AF7');
  console.log('Connected!');

  client.eegReadings
    .filter(data => data.electrode === leftEye)
    .map(data => Math.max(...data.samples.map(Math.abs)))
    .filter(value => value > 150)
    .switchMap(stam => Observable.merge(
      Observable.of(true),
      Observable.timer(300).map(() => false)
    ))
    .distinctUntilChanged()
    .subscribe(blink => {
      if (blink) {
        eye.classList.add('blink');
      } else {
        eye.classList.remove('blink');
      }
    })
}

window.connect = connect;
