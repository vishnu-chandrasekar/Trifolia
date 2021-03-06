import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../../shared/fhir.service';
import {FileModel} from '../../models/file-model';

@Component({
  selector: 'app-file-open-modal',
  templateUrl: './file-open-modal.component.html',
  styleUrls: ['./file-open-modal.component.css']
})
export class FileOpenModalComponent implements OnInit {
  @Input() captureVersion = true;
  public fhirVersion = '3.0.1';
  public file: FileModel;

  constructor(
    public activeModal: NgbActiveModal,
    private fhirService: FhirService) {

  }

  fileChanged(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      const content = <string>reader.result;
      let resource;
      let isXml = false;

      if (content.trim().indexOf('{') === 0) {
        try {
          resource = JSON.parse(content);
        } catch (ex) {
          alert('Could not parse resource JSON: ' + ex.message);
          return;
        }
      } else if (content.trim().indexOf('<') === 0) {
        try {
          resource = this.fhirService.deserialize(content);
          isXml = true;
        } catch (ex) {
          alert('Could not parse resource XML: ' + ex.message);
          return;
        }
      }

      this.file = new FileModel();
      this.file.name = file.name;
      this.file.content = content;
      this.file.resource = resource;
      this.file.isXml = isXml;
    };

    reader.readAsText(file);
  }

  ok() {
    if (!this.file || !this.fhirVersion) {
      return;
    }

    this.file.fhirVersion = this.fhirVersion;
    this.activeModal.close(this.file);
  }

  ngOnInit() {
  }
}
