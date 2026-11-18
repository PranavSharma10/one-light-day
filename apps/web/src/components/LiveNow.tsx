import { useNow } from "../hooks/useNow";
import type { VoyagerState } from "../lib/ephemeris";
import Readout from "./Readout";
import TalkToVoyager from "./TalkToVoyager";

interface Props {
  stateAt: (ms: number) => VoyagerState;
  loading: boolean;
}

/** The fast-ticking part of the page: one 100 ms clock shared by the readout and Talk to Voyager. */
export default function LiveNow({ stateAt, loading }: Props) {
  const now = useNow(100);

  return (
    <>
      <Readout state={stateAt(now)} loading={loading} />
      <TalkToVoyager now={now} stateAt={stateAt} />
    </>
  );
}