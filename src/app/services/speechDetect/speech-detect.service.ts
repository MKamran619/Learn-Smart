import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from '../sharedServices/shared.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpeechDetectService {
  transcription: string = ''; // Store the transcribed text
  accuracyScore: number = 0; // Store the accuracy score
  noResponse = '';
  onShowResult = false;
  referenceText: string = '';
  resultList: {
    letter?: string;
    word?: string;
    sentence?: string;
    noResponse: string;
    userSpoke: string;
    accuracy: any;
  }[] = [];

  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];
  // transcription: string = '';
  estimatedTime: any;

  artyom: any;
  constructor(private http: HttpClient, public sharedService: SharedService) {
    // this.artyom = new Artyom();
  }

  // Function to start speech recognition using Web Speech API
  startSpeechRecognition() {
    console.log('Speech recognition started');
    this.transcription = '';
    this.accuracyScore = 0;
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Set language to English
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setTimeout(() => {
      recognition.stop();

      recognition.onresult = (event: any) => {
        this.transcription = event.results[0][0].transcript;
        // console.log('Transcribed Text: ', this.transcription);

        console.log('single result', this.transcription);
        // After transcription, calculate accuracy score
        this.accuracyScore = this.calculateAccuracy(
          this.referenceText,
          this.transcription
        );
        // console.log('Accuracy Score: ', this.accuracyScore);
      };
      // this.noResponse = '';

      recognition.onerror = (event: any) => {
        this.transcription = '';
        this.accuracyScore = 0;
        this.noResponse = 'true';
        // console.error('Speech recognition error: ', event.error);
      };

      const timeoutDuration = 5000; // Time in milliseconds

      console.log('Speech recognition stopped after timeout');
    }, 4000);
  }

  calculateSpeakingTime(text: string): number {
    const words = text.trim().split(/\s+/).length; // Count words
    const wordsPerSecond = 2.5; // Average speaking rate (words per second)
    return words / wordsPerSecond;
  }
  startRecording(estimatedTime: any) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.start();
        console.log('Recording started...');

        setTimeout(() => {
          this.stopRecording(stream);
        }, estimatedTime * 4500);
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
      });
  }

  stopRecording(stream: any) {
    console.log('Recording stoped..');
    if (!this.mediaRecorder) return;
    console.log('this.mediaRecorder');

    this.mediaRecorder.stop();
    stream.getTracks().forEach((track: any) => track.stop());

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      console.log('audioBlob = ', audioBlob);

      this.audioChunks = []; // Clear the audio chunks
      this.transcribeAudio(audioBlob);
    };
  }
  transcribeAudio(audioBlob: Blob) {
    // this.sharedService.isLoading = true;
    const apiKey = '5221502e1ff6076de6eb5f51a27e883cd1637ada';
    const url = 'https://api.deepgram.com/v1/listen';
    const headers = {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'audio/wav',
    };

    this.http
      .post(url, audioBlob, { headers })
      .pipe(
        finalize(() => {
          this.sharedService.isLoading = false;
        })
      )
      .subscribe((response: any) => {
        this.transcription =
          response.results.channels[0].alternatives[0].transcript;

        console.log('origonal = ', this.referenceText);
        console.log('origonal = ', this.transcription);

        this.accuracyScore = this.calculateAccuracy(
          this.referenceText,
          this.transcription
        );
      });
  }

  // Function to clean text (remove special characters and convert to lowercase)
  cleanText(text: string): string {
    return text.replace(/[^A-Za-z0-9\s]/g, '').toLowerCase();
  }

  // Function to calculate the accuracy using sequence matching (similar to difflib)
  calculateAccuracy(referenceText: string, transcribedText: string): number {
    const cleanedReference = this.cleanText(referenceText);
    const cleanedTranscription = this.cleanText(transcribedText);

    const accuracy = this.getSimilarity(cleanedReference, cleanedTranscription);
    return accuracy * 100; // Return percentage score
  }

  // Function to calculate string similarity (based on Levenshtein distance)
  getSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const dp: number[][] = Array.from({ length: len1 + 1 }, () =>
      Array(len2 + 1).fill(0)
    );

    for (let i = 0; i <= len1; i++) {
      for (let j = 0; j <= len2; j++) {
        if (i === 0) {
          dp[i][j] = j;
        } else if (j === 0) {
          dp[i][j] = i;
        } else if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]);
        }
      }
    }
    const distance = dp[len1][len2];
    const maxLen = Math.max(len1, len2);

    return (maxLen - distance) / maxLen; // Return similarity ratio
  }
  speakText(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Optionally set voice, pitch, and rate
    utterance.voice = speechSynthesis.getVoices()[0]; // Select the first available voice
    utterance.pitch = 1; // Default pitch
    utterance.rate = 1; // Default rate

    speechSynthesis.speak(utterance);
  }

  //import Artyom from 'artyom.js'; import Artyom from 'artyom.js';
}
