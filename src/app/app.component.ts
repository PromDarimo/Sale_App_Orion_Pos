import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  Filter!: string;
  emailId!: string;//declared for translate
  constructor(public translate: TranslateService) {
      // Register translation languages
      // translate.addLangs(['English', 'Japanese', 'Khmer']);
      translate.addLangs(['English', 'Khmer']);
      // Set default language
      translate.setDefaultLang('English');
      }
      translateLanguageTo(lang: string) {
        this.translate.use(lang);
      }
      getTitleString() {
        this.translate.get(['USER_INFO.EMAIL_ADDRESS'])
          .subscribe(translations => {
            this.emailId = translations['USER_INFO.EMAIL_ADDRESS'];
          });
      }
}
