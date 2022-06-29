import AdminRepo from "../database/repo/admin.repo.js";

export const getAllUsers = async (req, res) => {
  try {
    if (!req.admin) return res.status(300).send("Unauthorized");

    const users = await AdminRepo.getAllUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    if (!req.admin) return res.status(300).send("Unauthorized");
    const { verified, banned, admin, uid } = req.body;

    const user = await AdminRepo.updateUser(uid, { verified, banned, admin });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCollegesInfo = async (req, res) => {
  try {
    if (!req.admin) return res.status(300).send("Unauthorized");

    const colleges = await AdminRepo.getCollegesInfo();

    return res.status(200).json(colleges);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addCollegeInfo = async (req, res) => {
  try {
    if (!req.admin) return res.status(300).send("Unauthorized");

    const { collegeName, domainName } = req.body;

    const college = await AdminRepo.addCollegeInfo({ collegeName, domainName });

    return res.status(200).json(college);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
