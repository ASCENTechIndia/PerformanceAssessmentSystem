const oracledb = require("oracledb");
const { getConnection } = require("../../config/database");

const senderMasterList = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select num_sender_id,var_sender_name from aoio_sender_mas`;
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
    res.status(500);
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
};
