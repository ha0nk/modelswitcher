export const Reward = ({  title = "",  cost = 0,  prompt = "",  backgroundColor = "#8b8b8b",  maxRedemptionsPerUserPerStream = 0,  maxRedemptionsPerStream = 0,  globalCooldown = 0, autoFulfill = false,  userInputRequired = false,  isEnabled = false }) => {
  return (<div className="reward">
    {title}
  </div>)
}