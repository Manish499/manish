import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { VertexAiService } from '../service/vertex-ai.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-gen-ai-solution',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './gen-ai-solution.component.html',
  styleUrl: './gen-ai-solution.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GenAiSolutionComponent {
    endpoint: string = "";
  headers: HttpHeaders | undefined;
  prompt: any;

  checkoutForm: any;
  vertexOutput: any = '';
  isLoading = false;

  constructor(public http: HttpClient, private formBuilder: FormBuilder,
    private vertexAiService: VertexAiService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      textPrompt: new FormControl(''),
      codePrompt: new FormControl(null)
    });
  }

  onFilePicked(event: Event) {
    const file = (event?.target as any)?.files.item(0); // Here we use only the first file (single file)
    var reader: any = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => {
    const result: any = reader.result.split(',')[1];
    this.checkoutForm.patchValue({ filePrompt: result});
   };
    
  }

  onSubmit() {
    const promptValue = this.checkoutForm.get('textPrompt').value;
    const fileUri = this.checkoutForm.get('codePrompt')?.value || '';
    this.spinner.show();
    this.vertexAiService.getCodeGeneration(promptValue, fileUri).subscribe((response: any) => {
          // const output = response.candidates?.[0].content.parts[0].text;
          const output = response.predictions[0].content;
          this.vertexOutput = this.vertexOutput + '<br> <br>' + output.replaceAll('\n', '<br>');
          this.spinner.hide();
          console.log(this.vertexOutput);
        });
  }
}
