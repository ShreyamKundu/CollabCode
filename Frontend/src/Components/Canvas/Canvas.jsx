import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectMeetingId } from "../../../features/meetingSlice";
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { useSyncDemo } from '@tldraw/sync'

function Canvas({ socketRef }) {
  const meetingId = useSelector(selectMeetingId);
  const store = useSyncDemo({ roomId: meetingId })

  return (
    <>
      <div>
        <button
          className="btn bg-accent text-white"
          onClick={() => document.getElementById("my_modal_2").showModal()}
        >
          Canvas
          <FontAwesomeIcon icon={faPalette} />
        </button>

        <dialog
          id="my_modal_2"
          className="modal z-20"
          onClick={(e) => e.target === e.currentTarget && e.target.close()}
        >
          <div className="modal-box min-h-fit min-w-fit p-0 overflow-hidden">
            <form method="dialog" className="modal-backdrop"></form>
            <div className="flex justify-center items-center h-[650px] w-[1300px]">
              <div className="h-full w-full">
              <Tldraw  store={store}/>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}

export default Canvas;