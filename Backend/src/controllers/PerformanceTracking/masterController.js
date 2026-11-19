const oracledb = require("oracledb");
const { getConnection } = require("../../config/database");

async function AOPT_TASKTYPE_INSUPD(req, res) {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN
      AOPT_TASKTYPE_INSUPD
        (
            :IN_MODE,               
            :IN_TASKTYPE_ID,        
            :IN_TASKTYPE_NAME,  
            :IN_TASKTYPE_ULBID,     
            :IN_TASKTYPE_DESC,      
            :IN_TASKTYPE_ISACTIVE,  
            :IN_USERID,
            :out_ErrorCode,         
            :out_ErrorMsg
        );
      END;`;

    const bind = {
      IN_MODE: Number(payload.IN_MODE),
      IN_TASKTYPE_ID:
        payload.IN_TASKTYPE_ID === null || payload.IN_TASKTYPE_ID === undefined
          ? 0
          : Number(payload.IN_TASKTYPE_ID),
      IN_TASKTYPE_NAME: payload.IN_TASKTYPE_NAME,
      IN_TASKTYPE_ULBID: Number(payload.IN_TASKTYPE_ULBID),
      IN_TASKTYPE_DESC: payload.IN_TASKTYPE_DESC ?? "",
      IN_TASKTYPE_ISACTIVE: payload.IN_TASKTYPE_ISACTIVE,
      IN_USERID: payload.IN_USERID,
      out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_ErrorMsg: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result = await connection.execute(query, bind, { autoCommit: true });

    res.json({
      success: true,
      errorCode: result.outBinds.out_ErrorCode,
      errorMessage: result.outBinds.out_ErrorMsg,
    });
  } catch (error) {
    console.error("AOPT_TASKTYPE_INSUPD error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getTaskTypeList(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const query = `select * from view_TASKTYPE_list`;

    const result = await connection.execute(
      query,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getTaskTypeList error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getTaskTypeDropdown(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const query = `select tasktype_id, tasktype_name from view_TASKTYPE_list`;

    const result = await connection.execute(
      query,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getTaskTypeDropdown error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

module.exports = {
  AOPT_TASKTYPE_INSUPD,
  getTaskTypeList,
  getTaskTypeDropdown,
};
