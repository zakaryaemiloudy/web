import { Component, OnInit, signal, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatbotService } from '../../core/services/chatbot.service';
import { finalize, Observable, of } from 'rxjs';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

interface ChatbotResponse {
  response: string;
  suggestions?: string[];
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  messages = signal<ChatMessage[]>([]);
  isTyping = signal(false);
  isOnline = signal(true);
  chatForm: FormGroup;
  suggestions = signal<string[]>([]);
  
  // Quick action buttons
  quickActions = [
    { text: 'Comment donner du sang?', icon: 'volunteer_activism' },
    { text: 'Quels sont les critères?', icon: 'fact_check' },
    { text: 'Où trouver un hôpital?', icon: 'local_hospital' },
    { text: 'Types de sang', icon: 'bloodtype' },
    { text: 'Urgence médicale', icon: 'emergency' },
    { text: 'Mon profil donneur', icon: 'person' }
  ];

  constructor(
    private fb: FormBuilder,
    private chatbotService: ChatbotService
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializeChat();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private initializeChat(): void {
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      text: 'Bonjour! Je suis votre assistant virtuel pour la banque de sang. Je peux vous aider avec:\n\n🩸 Information sur le don de sang\n🏥 Localisation des hôpitaux\n📋 Critères d\'éligibilité\n🆘 Urgences médicales\n👤 Gestion de profil\n\nComment puis-je vous aider aujourd\'hui?',
      sender: 'bot',
      timestamp: new Date()
    };
    
    this.messages.set([welcomeMessage]);
    this.updateSuggestions([
      'Comment donner du sang?',
      'Quels sont les critères?',
      'Où trouver un hôpital?'
    ]);
  }

  sendMessage(): void {
    const messageText = this.chatForm.get('message')?.value?.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: this.generateId(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.update(current => [...current, userMessage]);
    this.chatForm.get('message')?.setValue('');
    this.scrollToBottom();

    // Show typing indicator
    this.isTyping.set(true);
    this.suggestions.set([]);

    // Send to backend
    this.chatbotService.sendMessage(messageText).pipe(
      finalize(() => this.isTyping.set(false))
    ).subscribe({
      next: (response: ChatbotResponse) => {
        this.handleBotResponse(response);
      },
      error: (error: any) => {
        console.error('Chatbot error:', error);
        this.addErrorMessage();
      }
    });
  }

  private handleBotResponse(response: ChatbotResponse): void {
    const botMessage: ChatMessage = {
      id: this.generateId(),
      text: response.response,
      sender: 'bot',
      timestamp: new Date()
    };

    this.messages.update(current => [...current, botMessage]);
    this.updateSuggestions(response.suggestions || []);
    this.scrollToBottom();
  }

  private addErrorMessage(): void {
    const errorMessage: ChatMessage = {
      id: this.generateId(),
      text: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants ou contacter notre support au 0800-123456.',
      sender: 'bot',
      timestamp: new Date()
    };

    this.messages.update(current => [...current, errorMessage]);
    this.updateSuggestions(['Réessayer', 'Contacter le support']);
  }

  selectSuggestion(suggestion: string): void {
    this.chatForm.get('message')?.setValue(suggestion);
    this.sendMessage();
  }

  selectQuickAction(action: string): void {
    this.chatForm.get('message')?.setValue(action);
    this.sendMessage();
  }

  private updateSuggestions(newSuggestions: string[]): void {
    this.suggestions.set(newSuggestions);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Computed properties
  hasMessages = computed(() => this.messages().length > 1);
  
  // Format message text with line breaks
  formatMessage(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  // Handle Enter key
  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
