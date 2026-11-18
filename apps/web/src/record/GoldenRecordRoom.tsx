import CoverExplorer from "./CoverExplorer";
import PictureToSound from "./PictureToSound";
import TwoClocks from "./TwoClocks";
import WhatsOnIt from "./WhatsOnIt";
import MyRecord from "./MyRecord";
import "./record.css";

/** The Golden Record room (#record). Each part is its own section. */
export default function GoldenRecordRoom() {
  return (
    <div className="gr-room">
      <header className="gr-hero">
        <p className="eyebrow">The Golden Record room</p>
        <h1>A message in a bottle, thrown into the cosmic ocean</h1>
        <p className="gr-lede">
          Bolted to the side of Voyager 1 is a 12-inch gold-plated copper record, with sounds and pictures from Earth. Its cover
          explains how to play it to anyone who finds it, without a single word. Let's decode it the way they would.
        </p>
      </header>
      <CoverExplorer />
      <PictureToSound />
      <TwoClocks />
      <WhatsOnIt />
      <MyRecord />
    </div>
  );
}
