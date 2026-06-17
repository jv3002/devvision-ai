const enforceOrganization = (req, res, next) => {
  if (!req.user || !req.user.memberships.length) {
    return res.status(403).json({
      message: "Organization access denied",
    });
  }

  const organizationId = req.user.memberships[0].organizationId;

  req.organizationId = organizationId;

  next();
};

export default enforceOrganization;