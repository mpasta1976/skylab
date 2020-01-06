import app from './app';
import general from './config/general'

console.log(general.app_port);

app.listen(general.app_port);
