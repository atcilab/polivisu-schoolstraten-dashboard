import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CreateProjectValidator } from "src/app/shared/validations/createProject.validation";
import { IRoadSegment } from "src/app/shared/models";
import { WatcherService } from "../../services/watcher.service";

@Component({
  selector: "segments",
  templateUrl: "./segments.component.html",
  styleUrls: ["./segments.component.scss"],
})
export class SegmentsComponent implements OnInit {
  @Output() onRemove: EventEmitter<IRoadSegment> = new EventEmitter();
  available: IRoadSegment[] = [];
  target: IRoadSegment[] = [];
  impact: IRoadSegment[] = [];

  constructor(
    public validator: CreateProjectValidator,
    private _watcher: WatcherService
  ) {
    this.validator.project$.subscribe((p) => {
      this.available = p.roadNames.filter((r) => {
        if (
          !this.target.some((s) => s.id === r.id) &&
          !this.impact.some((s) => s.id === r.id)
        )
          return true;
        else return false;
      });
    });
  }

  ngOnInit() {}

  onRemoveRoad(value: IRoadSegment) {
    if (this.available.some((r) => r.id === value.id)) {
      this.available = this.available.filter((r) => r.id !== value.id);
    } else if (this.target.some((r) => r.id === value.id)) {
      this.target = this.target.filter((r) => r.id !== value.id);
    } else if (this.impact.some((r) => r.id === value.id)) {
      this.impact = this.impact.filter((r) => r.id !== value.id);
    }

    this.validator.removeRroadName(value);
    this.onRemove.emit(value);
    this._watcher.target = this.target[0];
  }

  onTargetChange(val: IRoadSegment[]) {
    this.validator.schoolStreetCamera = val[0];
    this._watcher.target = val[0];
  }

  onImpactChange(val: IRoadSegment[]) {
    this.validator.neighbouringStreetCameras = val;
  }
}
