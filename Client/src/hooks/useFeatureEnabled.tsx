import { useState } from "react";

const useFeatureEnabled = (condition: () => boolean) => {
  return useState(condition);
};

export default useFeatureEnabled;
