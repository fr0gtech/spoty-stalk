import { Icon, Slider } from "@blueprintjs/core";
import { useDispatch, useSelector } from "react-redux";
import { selectLastVolume, selectVolume, setLastVolume, setVolume } from "../../redux/playerSlice";

function Volume(){
    const dispatch = useDispatch()
    const volume = useSelector(selectVolume)
    const lastVolume = useSelector(selectLastVolume)

    return (
              <div
                onWheel={(e) => {
                  const setTo = Math.min(
                    Math.max(volume + (e.deltaY / 1000) * -1, 0),
                    1
                  );
                  dispatch(setVolume(setTo));
                }}
                className="flex gap-4"
                id="scslider"
              >
                <Icon
                  onClick={() => {
                    if (volume === 0) dispatch(setVolume(lastVolume || 0.25));
                    if (volume > 0) {
                      dispatch(setLastVolume(volume));
                      dispatch(setVolume(0));
                    }
                  }}
                  className="opacity-50"
                  icon={
                    volume > 0.5
                      ? "volume-up"
                      : volume === 0
                      ? "volume-off"
                      : "volume-down"
                  }
                />
                <Slider
                  className="volumeSlider"
                  value={volume}
                  onChange={(e: any) => {                
                    dispatch(setVolume(e))}}
                  labelRenderer={false}
                  stepSize={0.05}
                  min={0}
                  max={1}
                />
              </div>

    )
}

export default Volume