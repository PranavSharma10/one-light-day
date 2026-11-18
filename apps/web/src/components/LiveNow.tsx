import { useNow } from "../hooks/useNow";
import { useVoyager } from "../hooks/useVoyager";
import Readout from "./Readout";
import TalkToVoyager from "./TalkToVoyager";

/** Everything that ticks shares one clock and one source of Voyager's position. */
export default function LiveNow() {
  const now = useNow(100);
  const { stateAt, loading } = useVoyager();

  return (
    <>
      <Readout state={stateAt(now)} loading={loading} />
      <TalkToVoyager now={now} stateAt={stateAt} />
    </>
  );
}