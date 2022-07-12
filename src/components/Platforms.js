export default function Platforms({ platforms }) {
  return (
    <>
      {platforms?.map((platform, index) => {
        return `${platform.platform.name}${index < platforms.length - 1 ? "|" : ""}`;
      })}
    </>
  );
}
