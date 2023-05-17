const getTheme = (mode) => {
  return {
    token: {
      containerBg: mode.containerBg,
      textColor: mode.textColor,
      colorPrimary: mode.primaryColor,
      colorSecondary: mode.secondaryColor,
      colorBgContainer: mode.colorBgContainer,
      breadCrumb: mode.breadCrumb,
      switchColor: mode.switchColor,
      colorText: mode.colorText,
      algorithm: mode.algorithm,
      graphLine: mode.graphLine,
      colorBgElevated: mode.colorBgElevated,
      colorPrimaryBg: mode.colorPrimaryBg,
      colorSuccessBg: mode.colorSuccessBg,
      colorTextQuaternary: mode.colorTextQuaternary,
      colorErrorBg: mode.colorErrorBg,
      colorTooltip: mode.colorTooltip,
    },
  };
};

export default getTheme;
