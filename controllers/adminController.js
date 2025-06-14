const { User, Company, Job, Application } = require('../models');

// Admin Dashboard Controller
const renderAdminDashboard = async (req, res) => {
  try {
    // Fetch data for all sections
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'] });
    const companies = await Company.findAll({ attributes: ['companyId', 'companyName', 'address', 'contactInfo', 'userid'] });
    const jobs = await Job.findAll({
      attributes: ['id', 'jobTitle', 'jobDescription', 'location', 'jobType', 'salary', 'companyId'],
      include: { model: Company, attributes: ['companyName'] },
    });

    
    res.render('adminDashboard', { users, companies, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error loading admin dashboard' });
  }
};

// View all users
const viewUsers = async (req, res) => {
    try {
      const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'] });
      res.render('adminUsers', { users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  };
  
  // View all companies
  const viewCompanies = async (req, res) => {
    try {
      const companies = await Company.findAll({
        attributes: ['companyId', 'companyName', 'address', 'contactInfo', 'userid'],
      });
      res.render('adminCompanies', { companies });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching companies' });
    }
  };
  
  // View all jobs
  const viewJobs = async (req, res) => {
    try {
      const jobs = await Job.findAll({
        attributes: ['id', 'jobTitle', 'jobDescription', 'location', 'jobType', 'salary', 'companyId'],
        include: { model: Company, attributes: ['companyName'] },
      });
      res.render('adminJobs', { jobs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching jobs' });
    }
  };
  
// Edit a user role
const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    await User.update({ role }, { where: { id: userId } });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error editing user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    
    const user = await User.findOne({ where: { id: userId } });

    // If the user does not exist, return a 404 error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is an admin
    if (user.role === 'Admin') {  // Check if the user role is 'Admin'
      return res.status(403).json({ message: 'Cannot delete an admin user' });
    }

    // Proceed with the deletion if the user is not an admin
    await Application.destroy({ where: { userId } });
    await Company.destroy({ where: { userid: userId } });
    await User.destroy({ where: { id: userId } });

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error deleting user:', error);  // Added more detailed error logging
    res.status(500).json({ message: 'Error deleting user' });
  }
};


// Delete a company
const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    await Job.destroy({ where: { companyId } });
    await Company.destroy({ where: { companyId } });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting company' });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    await Application.destroy({ where: { jobId } });
    await Job.destroy({ where: { id: jobId } });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting job' });
  }
};

module.exports = {
    renderAdminDashboard,
    viewUsers,
    viewCompanies,
    viewJobs,
    editUser,
    deleteUser,
    deleteCompany,
    deleteJob,
    };