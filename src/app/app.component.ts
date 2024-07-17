import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createPrompt } from '../models/vertex-ai.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vertexAi';
  endpoint: string = "";
  headers: HttpHeaders | undefined;
  prompt: any;
  // textPrompt = '';

  checkoutForm: any;

  constructor(public http: HttpClient, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      textPrompt: ''
    });
    // this.TestVertexAIWithoutApiKey();
  }

  TestVertexAIWithoutApiKey() {
    const PROJECT_ID = 'vertex-ai-with-angular-sample';
    const GCLOUD_AUTH_PRINT_ACCESS_TOKEN = 'ya29.a0AXooCguGcxHbmcbzbMS6OnL9JZCk28VV3mRZXUhM2mSnptKtETIc0-WnMzHBYJWjxeKSFIuH5aQ8ImisJuv9-owReYNG-ODt3fPoC5R7G9MLwC2fx1MoOkde4Y1Ie0miVHaXNPB6iHiDJ8-UBmUxucHU-b1iXCYe6mB1cA2gOgaCgYKASoSARASFQHGX2MirgusJzMdZP496nAN5_jrFA0177';
    
    this.buildEndpointUrl(PROJECT_ID);
    this.getAuthHeaders(GCLOUD_AUTH_PRINT_ACCESS_TOKEN);
    
    this.http.post<any>(this.endpoint, this.prompt, { headers: this.headers })
      .subscribe(response => {
        console.log(response.predictions[0].content);
      });
  }

  getAuthHeaders(accessToken: string) {
    this.headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accessToken}`);
  }

  buildEndpointUrl(projectId: string) {
    const BASE_URL = "https://us-central1-aiplatform.googleapis.com/";
    const API_VERSION = 'v1';        // may be different at this time
    const MODEL = 'text-bison';      
  
    let url = BASE_URL;              // base url
    url += API_VERSION;              // api version
    url += "/projects/" + projectId; // project id
    url += "/locations/us-central1"; // google cloud region
    url += "/publishers/google";     // publisher
    url += "/models/" + MODEL;       // model
    url += ":predict";               // action
  
    this.endpoint = url;
  }

  onSubmit() {
    const promptValue = this.checkoutForm.get('textPrompt').value;
    this.prompt = createPrompt(promptValue);
    this.TestVertexAIWithoutApiKey();
  }
}
