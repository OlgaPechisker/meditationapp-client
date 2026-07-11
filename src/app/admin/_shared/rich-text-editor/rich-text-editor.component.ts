import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import type Quill from 'quill';

const EMPTY_DOCUMENT = /^(?:<p><br\s*\/?><\/p>|\s*)$/i;

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [FormsModule, QuillEditorComponent],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RichTextEditorComponent),
    multi: true,
  }],
})
export class RichTextEditorComponent implements ControlValueAccessor {
  readonly value = signal('');
  readonly disabled = signal(false);
  private editor: Quill | undefined;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  onValueChange(value: string | null): void {
    const normalized = value && !EMPTY_DOCUMENT.test(value) ? value : '';
    this.value.set(normalized);
    this.onChange(normalized);
  }

  onEditorCreated(editor: Quill): void {
    this.editor = editor;
    editor.enable(!this.disabled());
  }

  undo(): void {
    this.editor?.history.undo();
  }

  redo(): void {
    this.editor?.history.redo();
  }

  clearFormatting(): void {
    const range = this.editor?.getSelection();
    if (range) {
      this.editor?.removeFormat(range.index, range.length, 'user');
    }
  }

  markTouched(): void {
    this.onTouched();
  }
}
