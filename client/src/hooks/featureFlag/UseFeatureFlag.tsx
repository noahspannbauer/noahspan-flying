import { useAppContext } from '../appContext/UseAppContext';

export const useFeatureFlag = (featureFlagKey: string) => {
  const appContext = useAppContext();
  const featureFlag = appContext.state.featureFlags.find(
    (featureFlag) => featureFlag.key === featureFlagKey
  );
  console.log(featureFlag)
  return featureFlag;
};
