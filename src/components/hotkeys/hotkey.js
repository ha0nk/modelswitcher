export const Hotkey = ({hotkey: {name, type, file, hotkeyID}, isEditing}) =>{
  return (<div>
    {name} {type}
  </div>)
}