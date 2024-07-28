import { Component } from '@angular/core';
import { GenAiSolutionComponent } from "./gen-ai-solution/gen-ai-solution.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GenAiSolutionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vertexAi';
}
