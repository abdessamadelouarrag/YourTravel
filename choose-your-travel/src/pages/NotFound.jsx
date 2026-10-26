import { Compass, ArrowUpRight } from "lucide-react";
import { Button } from "../components/ui";
export default function NotFound() {
  return (
    <div className="page-shell not-found container">
      <Compass size={65} strokeWidth={1} />
      <span className="eyebrow">404 · A LITTLE OFF THE BEATEN PATH</span>
      <h1>
        Even a wrong turn
        <br />
        can lead <span className="serif">somewhere good.</span>
      </h1>
      <p>This page isn’t on the map. Let’s find you a different adventure.</p>
      <Button to="/explore">
        Back to exploring
        <ArrowUpRight size={17} />
      </Button>
    </div>
  );
}
