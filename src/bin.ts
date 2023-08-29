import { App } from 'cdktf';
import { DoesUserHaveInternet } from './DoesUserHaveInternet';

const app = new App();


new DoesUserHaveInternet(app, 'datadog');
app.synth();
