import { useAppContext } from '../appContext/UseAppContext';

export const useFeatureFlag = (featureFlagId: string) => {
  const appContext = useAppContext();
  const featureFlag = appContext.state.featureFlags.find(
    (featureFlag) => featureFlag.id === featureFlagId
  );

  return featureFlag;
};
