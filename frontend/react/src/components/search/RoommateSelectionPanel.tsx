import React from "react";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import { RoommateProfileSnippetPanel } from "./RoommateProfileSnippetPanel";

import {
  fetchAllProfiles,
  fetchRecommendedProfiles,
} from "../../util/ApiCalls";

interface RoommateSelectionPanelProps {
  setRoommate: React.Dispatch<any>;
}

export const RoommateSelectionPanel: React.FC<RoommateSelectionPanelProps> = (
  props: RoommateSelectionPanelProps
) => {
  const [roommates, setRoommates] = useState<any>([]);
  const [recommendedRoommates, setRecommendedRoommates] = useState<any>([]);

  // API returns { username, profile }
  const getAllProfiles = async () => {
    const response = await fetchAllProfiles();
    if (response.ok) {
      setRoommates(await response.json());
    }
  };

  const getRecommendedProfiles = async () => {
    const response = await fetchRecommendedProfiles();
    if (response.ok) {
      setRecommendedRoommates(await response.json());
    }
  };

  useEffect(() => {
    getAllProfiles();
    getRecommendedProfiles();
  }, []);

  return (
    <div className="roommate-selection-panel">
      <Tabs>
        <TabList>
          <Tab>Recommendations</Tab>
          <Tab>All Roommates</Tab>
        </TabList>

        <TabPanel>
          <RoommateProfileSnippetPanel
            roommates={recommendedRoommates}
            setRoommate={props.setRoommate}
          />
        </TabPanel>
        <TabPanel>
          <RoommateProfileSnippetPanel
            roommates={roommates}
            setRoommate={props.setRoommate}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};
