import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent {
  @Input() videoId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  public deleteTitle = 'Delete this video?';
  public deleteText =
    'Are you sure you want to delete this video? This action cannot be undone.';
  public cancelButton = 'Cancel';
  public deleteButton = 'Delete video';

  public onCancel(): void {
    this.close.emit();
  }

  public onDelete(): void {
    this.confirmDelete.emit(this.videoId);
  }
}
