export function createPrompt(
    prompt: string = "What is the largest number with a name?",
    temperature: number = 0.7,
    maxOutputTokens: number = 100,
    topP: number = 0.95,
    topK: number = 40
  ): any {
    const request : any = {
      "instances": [
        {
          "prompt": `${prompt}`
        }
      ],
      "parameters": {
        "temperature": temperature,
        "maxOutputTokens": maxOutputTokens,
        "topP": topP,
        "topK": topK
      }
    }
    return request;
  }