import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { helpers } from '@google-cloud/aiplatform';
@Injectable({
  providedIn: 'root'
})
export class VertexAiService {

    constructor(private http: HttpClient) {}

    getVertexAiResponse(fileUri: any, textPrompt: any) {
        const endPoint = this.buildEndpointUrl(environment.PROJECT_ID);
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${environment.GCLOUD_AUTH_PRINT_ACCESS_TOKEN}`);
        const prompt = this.buildGeminiProPrompt(textPrompt, fileUri);
        return this.http.post(endPoint, prompt, { headers });
    }

    buildGeminiProPrompt(textPrompt: any, fileUri?: any) {
      const parts = [{text: textPrompt}];
      if (fileUri) {
        const inlineDataObj: any = {
          inlineData: {
            // mimeType: "application/pdf",
            // data: "gs://manish499_file/Karma.pdf"
            mimeType: fileUri[0],
            data: fileUri[1]
          }
        } 
        parts.push(inlineDataObj);
      }
        return {
          contents: [
            {
              role: 'user',
              parts: parts,
              // parts: [
              //   // {
              //   //   fileData: {
              //   //     mimeType: "application/pdf",
              //   //     fileUri: "gs://manish499_file/Karma.pdf"
              //   //     // fileUri: fileUri
              //   //   }
              //   // },
              //   {
              //     inlineData: {
              //       mimeType: "application/pdf",
              //       // data: "gs://manish499_file/Karma.pdf"
              //       data: fileUri
              //     }
              //   },
              //   {
              //     // text: "Give me the solution of the issues in this file?"
              //     text: textPrompt
              //   }
              // ],
            },
          ],
          safetySettings: {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
          generationConfig: {
            temperature: 0.9,
            topP: 1,
            topK: 32,
            maxOutputTokens: 2048,
          },
        };
      }

    buildEndpointUrl(projectId: string) {
      // https://us-central1-prediction-aiplatform.clients6.google.com/ui/projects/vertex-ai-with-angular-sample/locations/us-central1/publishers/google/models/code-bison:predict?key=AIzaSyCI-zsRP85UVOi0DjtiCwWBwQ1djDy741g
        const BASE_URL = environment.BASE_URL;
        // const BASE_URL = 'https://us-central1-prediction-aiplatform.clients6.google.com';
        const API_VERSION = 'v1'; // may be different at this time
        const MODEL = environment.MODEL;
        let url = BASE_URL; // base url
        url += API_VERSION; // api version
        url += '/projects/' + projectId; // project id
        url += '/locations/us-central1'; // google cloud region
        url += '/publishers/google'; // publisher
        url += '/models/' + MODEL; // model
        url += ':predict'; // action
        return url;
        
      }

      getCodeGeneration(textPrompt: any, codePrompt?: any) {
        // const request = {
        //   endpoint,
        //   instances,
        //   parameters,
        // };
        const endPoint = this.buildEndpointUrl(environment.PROJECT_ID);
              const headers = new HttpHeaders()
              .set('Authorization', `Bearer ${environment.GCLOUD_AUTH_PRINT_ACCESS_TOKEN}`);
              // const prompt = this.buildPrompt(textPrompt, fileUri);
        const prompt = this.buildCodeBisenPrompt(endPoint, textPrompt, codePrompt);
              return this.http.post(endPoint, prompt, { headers });
      }

      buildCodeBisenPrompt(endPoint: any, textPrompt: any, codePrompt?: any) {
        const prompt = {
          // prefix: 'Write a function that checks if a year is a leap year.',
          prefix: textPrompt + '\n\n\n' + codePrompt,
        };
        const codePromptObj = {
          prefix: codePrompt
        };
        const instances = [prompt];
        // const instances = [instanceValue, codePrompInstanceValue];
      
        const parameter = {
          candidateCount: 2,
          temperature: 0.5,
          // maxOutputTokens: 256,
            topP: 1,
            // topK: 32,
            maxOutputTokens: 2048
        };
        return {
          // endPoint,
          instances: instances,
          parameters: parameter,
        };
      }

}


