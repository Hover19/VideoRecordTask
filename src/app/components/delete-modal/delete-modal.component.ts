import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent {
  @Input() videoId!: number; // Video ID to be deleted
  @Output() close = new EventEmitter<void>(); // Event to close the modal
  @Output() confirmDelete = new EventEmitter<number>(); // Event to delete video

  onCancel() {
    this.close.emit();
  }

  onDelete() {
    this.confirmDelete.emit(this.videoId);
  }
}
