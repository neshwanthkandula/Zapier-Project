"use client"
import axios from "axios";
import React, { useState, useEffect } from "react";
import ZapCells from "../../../components/zapcell";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import Model from "../../../components/model";
import { MetadataModal } from "../../../components/modelmetadata";
import { BACKEND_URL } from "../../config";
import { useRouter } from "next/navigation";

const Page = () => {
  const [AvailableTriggers, setAvailableTriggers] = useState<
    { id: string; name: string; image: string }[]
  >([]);
  const [selectedTrigger, setSelectedTrigger] = useState<{
    availableTriggerId: string;
    availableTriggerName: string;
    triggerMetadata?: { [key: string]: any };
  }>({ availableTriggerId: "-1", availableTriggerName: "Trigger" });

  const [AvailableActions, setAvailableActions] = useState<
    { id: string; name: string; image: string; metadataSchema?: { [key: string]: any } }[]
  >([]);
  const [selectedActions, setSelectedActions] = useState<
    {
      availableActionId: string;
      availableActionName: string;
      actionMetadata?: { [key: string]: any };
      metadataSchema?: { [key: string]: any };
    }[]
  >([]);

  const [Selectedmodeltrigger, setSelectedmodeltrigger] = useState(false);
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(null);
  const [openMetaIndex, setOpenMetaIndex] = useState<number | null>(null);
  const [openTriggerMeta, setOpenTriggerMeta] = useState(false);

  const router = useRouter();

  // Fetch available triggers and actions
  useEffect(() => {
    axios.get(`${BACKEND_URL}/trigger/available`).then((res) => {
      setAvailableTriggers(res.data.availableTriggers);
    });
    axios.get(`${BACKEND_URL}/action/available`).then((res) => {
      setAvailableActions(res.data.availableactions);
    });
  }, []);

  return (
    <div>
      {/* Publish Button */}
      <div className="bg-slate-200 flex justify-end py-4 px-4">
        <PrimaryButton
          onClick={async () => {
            
            try {
              const res = await axios.post(
                `${BACKEND_URL}/zap`,
                {
                  availableTriggerId: selectedTrigger.availableTriggerId,
                  triggerMetadata: selectedTrigger.triggerMetadata || {},
                  actions: selectedActions.map((a) => ({
                    availableActionId: a.availableActionId,
                    actionMetadata: a.actionMetadata || {},
                  })),
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                }
              );

              console.log("Zap created:", res.data);
            } catch (err) {
              console.error("Failed to create zap:", err);
            }
            router.push("/dashboard");
          }}
        >
          Publish
        </PrimaryButton>
      </div>

      {/* Working area */}
      <div className="w-full h-screen bg-slate-200 flex flex-col justify-center items-center">
        {/* Trigger */}
        <div className="py-2 hover:cursor-pointer">
          <ZapCells
            tittle={selectedTrigger.availableTriggerName}
            indx={1}
            onClick={() => {
              setOpenActionIndex(null);
              setSelectedmodeltrigger(!Selectedmodeltrigger);
            }}
          />
        </div>

        {/* Trigger Modal */}
        <div className="flex justify-center">
          {Selectedmodeltrigger && (
            <div className="absolute top-1/3 z-20">
              <Model
                Tittle="Trigger"
                availableitems={AvailableTriggers}
                onClick={(id, name) => {
                  setSelectedTrigger((prev) => ({
                    ...prev,
                    availableTriggerId: id,
                    availableTriggerName: name,
                  }));
                  setSelectedmodeltrigger(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div>
          {selectedActions.map((action, indx) => (
            <div key={indx} className="py-2 hover:cursor-pointer">
              <ZapCells
                tittle={action.availableActionName ?? "Action"}
                indx={2 + indx}
                onClick={() => {
                  setSelectedmodeltrigger(false);
                  setOpenActionIndex(indx);
                }}
              />

              {/* Action Select Modal */}
              <div className="flex justify-center">
                {openActionIndex === indx && (
                  <div className="absolute top-1/3 z-20 ">
                    <Model
                      Tittle="Action"
                      availableitems={AvailableActions}
                      onClick={(id, name) => {
                        const selectedAction = AvailableActions.find(a => a.id === id);
                        setSelectedActions((prev) => {
                          const newArr = [...prev];
                          newArr[indx] = {
                            ...newArr[indx],
                            availableActionId: id,
                            availableActionName: name,
                            metadataSchema: selectedAction?.metadataSchema || {},
                          };
                          return newArr;
                        });
                        setOpenActionIndex(null);
                        setOpenMetaIndex(indx); // open metadata after choosing
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Action Metadata Modal */}
              {openMetaIndex === indx && selectedActions[indx]?.metadataSchema && (
                <MetadataModal
                  title="Action Metadata"
                  metadataSchema={selectedActions[indx].metadataSchema!}
                  onSave={(metadata) =>
                    setSelectedActions((prev) =>
                      prev.map((a, i) =>
                        i === indx ? { ...a, actionMetadata: metadata } : a
                      )
                    )
                  }
                  onClose={() => setOpenMetaIndex(null)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Add Action Button */}
        <div className="text-lg mt-4">
          <PrimaryButton
            onClick={() => {
              setSelectedActions((prev) => [
                ...prev,
                {
                  availableActionId: "-1",
                  availableActionName: "Action",
                  metadataSchema: {},
                },
              ]);
            }}
          >
            +
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default Page;
