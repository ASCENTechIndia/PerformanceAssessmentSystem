const oracledb = require("oracledb");
const { getConnection } = require("../../config/database");

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

async function getParentTaskDropdown(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const query = `select task_id, task_title from view_task_list`;

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
    console.error("getParentTaskDropdown error:", error);
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

async function AOPT_TASK_INSUPD(req, res) {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN
      AOPT_TASK_INSUPD
        (
            :IN_MODE,
            :IN_TASK_ID,
            :IN_TASKTYPE_ID,
            :IN_TASK_TITLE,
            :IN_TASK_DESCRIPTION,
            :IN_TASK_COMPLETIONCRITERIA,
            :IN_TASK_EXCEPCTEDDAYS,
            :IN_TASK_PARENTID,
            :IN_TASK_ISACTIVE,
            :IN_USERID,
            :OUT_ERRORCODE,
            :OUT_ERRORMSG
        );
      END;`;

    const bind = {
      IN_MODE: payload.IN_MODE,
      IN_TASK_ID:
        payload.IN_TASK_ID === null || payload.IN_TASK_ID === undefined
          ? 0
          : Number(payload.IN_TASK_ID),
      IN_TASKTYPE_ID: Number(payload.IN_TASKTYPE_ID),
      IN_TASK_TITLE: payload.IN_TASK_TITLE,
      IN_TASK_DESCRIPTION: payload.IN_TASK_DESCRIPTION ?? "",
      IN_TASK_COMPLETIONCRITERIA: payload.IN_TASK_COMPLETIONCRITERIA ?? "",
      IN_TASK_EXCEPCTEDDAYS:
        payload.IN_TASK_EXCEPCTEDDAYS === null ||
        payload.IN_TASK_EXCEPCTEDDAYS === undefined
          ? 0
          : Number(payload.IN_TASK_EXCEPCTEDDAYS),
      IN_TASK_PARENTID:
        payload.IN_TASK_PARENTID === null ||
        payload.IN_TASK_PARENTID === undefined
          ? 0
          : Number(payload.IN_TASK_PARENTID),
      IN_TASK_ISACTIVE: payload.IN_TASK_ISACTIVE,
      IN_USERID: payload.IN_USERID,
      OUT_ERRORCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRORMSG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result = await connection.execute(query, bind, { autoCommit: true });

    res.json({
      success: true,
      errorCode: result.outBinds.OUT_ERRORCODE,
      errorMessage: result.outBinds.OUT_ERRORMSG,
    });
  } catch (error) {
    console.error("AOPT_TASK_INSUPD error:", error);
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

async function AOPT_TASKSTATUS_INSUPD(req, res) {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN
      AOPT_TASKSTATUS_INSUPD
        (
            :IN_MODE,
            :IN_TASKSTATUS_ID,
            :IN_TASKSTATUS_CODE,
            :IN_TASKSTATUS_NAME,
            :IN_TASKSTATUS_BGCOLOR,
            :IN_TASKSTATUS_FORECOLOR,
            :IN_DISPLAYORDER,
            :IN_FINALSTATUS,
            :IN_ISACTIVE,
            :IN_USERID,
            :OUT_ERRORCODE,
            :OUT_ERRORMSG
        );
      END;`;

    const bind = {
      IN_MODE: payload.IN_MODE,
      IN_TASKSTATUS_ID:
        payload.IN_TASKSTATUS_ID === null ||
        payload.IN_TASKSTATUS_ID === undefined
          ? 0
          : Number(payload.IN_TASKSTATUS_ID),
      IN_TASKSTATUS_CODE: payload.IN_TASKSTATUS_CODE,
      IN_TASKSTATUS_NAME: payload.IN_TASKSTATUS_NAME,
      IN_TASKSTATUS_BGCOLOR: payload.IN_TASKSTATUS_BGCOLOR ?? null,
      IN_TASKSTATUS_FORECOLOR: payload.IN_TASKSTATUS_FORECOLOR ?? null,
      IN_DISPLAYORDER:
        payload.IN_DISPLAYORDER === null ||
        payload.IN_DISPLAYORDER === undefined
          ? 0
          : Number(payload.IN_DISPLAYORDER),
      IN_FINALSTATUS:
        payload.IN_FINALSTATUS === null || payload.IN_FINALSTATUS === undefined
          ? 0
          : Number(payload.IN_FINALSTATUS),
      IN_ISACTIVE:
        payload.IN_ISACTIVE === null || payload.IN_ISACTIVE === undefined
          ? 1
          : Number(payload.IN_ISACTIVE),
      IN_USERID: payload.IN_USERID,
      OUT_ERRORCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRORMSG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result = await connection.execute(query, bind, { autoCommit: true });

    res.json({
      success: true,
      errorCode: result.outBinds.OUT_ERRORCODE,
      errorMessage: result.outBinds.OUT_ERRORMSG,
    });
  } catch (error) {
    console.error("AOPT_TASKSTATUS_INSUPD error:", error);
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
  getParentTaskDropdown,
  getTaskTypeDropdown,
  AOPT_TASK_INSUPD,
  AOPT_TASKSTATUS_INSUPD,
};
