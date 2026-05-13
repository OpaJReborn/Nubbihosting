const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const statusText = document.getElementById("status");
const fileList = document.getElementById("fileList");

async function loadFiles() {
  fileList.innerHTML = "Loading...";

  const { data, error } = await client
    .storage
    .from("uploads")
    .list();

  if (error) {
    fileList.innerHTML = "Failed to load files.";
    return;
  }

  fileList.innerHTML = "";

  if (data.length === 0) {
    fileList.innerHTML = "No files uploaded yet.";
    return;
  }

  data.forEach(file => {
    const { data: publicUrlData } = client
      .storage
      .from("uploads")
      .getPublicUrl(file.name);

    const div = document.createElement("div");
    div.className = "file-item";

    div.innerHTML = `
      <a href="${publicUrlData.publicUrl}" target="_blank">
        ${file.name}
      </a>
    `;

    fileList.appendChild(div);
  });
}

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file) {
    statusText.innerText = "Please choose a file.";
    return;
  }

  statusText.innerText = "Uploading...";

  const fileName = `${Date.now()}_${file.name}`;

  const { error } = await client
    .storage
    .from("uploads")
    .upload(fileName, file);

  if (error) {
    statusText.innerText = "Upload failed.";
loadFiles();
