import si from 'systeminformation';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get basic system information
 */
export async function getSystemInfo() {
  try {
    const osInfo = await si.osInfo();
    const system = await si.system();
    const cpu = await si.cpu();
    const mem = await si.mem();
    const time = await si.time();

    return {
      os: {
        platform: osInfo.platform,
        distro: osInfo.distro,
        release: osInfo.release,
        arch: osInfo.arch,
        hostname: osInfo.hostname
      },
      system: {
        manufacturer: system.manufacturer,
        model: system.model
      },
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
        speed: cpu.speed
      },
      memory: {
        total: `${(mem.total / 1024 / 1024 / 1024).toFixed(2)} GB`,
        free: `${(mem.free / 1024 / 1024 / 1024).toFixed(2)} GB`
      },
      uptime: {
        seconds: time.uptime,
        formatted: formatUptime(time.uptime)
      }
    };
  } catch (error) {
    throw new Error(`Failed to get system info: ${error.message}`);
  }
}

/**
 * Get current CPU usage
 */
export async function getCpuUsage() {
  try {
    const load = await si.currentLoad();
    const temp = await si.cpuTemperature();

    return {
      averageLoad: load.currentLoad.toFixed(2) + '%',
      cores: load.cpus.map((core, index) => ({
        core: index + 1,
        load: core.load.toFixed(2) + '%'
      })),
      temperature: temp.main ? `${temp.main}°C` : 'N/A'
    };
  } catch (error) {
    throw new Error(`Failed to get CPU usage: ${error.message}`);
  }
}

/**
 * Get memory usage
 */
export async function getMemoryUsage() {
  try {
    const mem = await si.mem();

    const totalGB = mem.total / 1024 / 1024 / 1024;
    const usedGB = mem.used / 1024 / 1024 / 1024;
    const freeGB = mem.free / 1024 / 1024 / 1024;
    const usagePercent = (mem.used / mem.total) * 100;

    return {
      total: `${totalGB.toFixed(2)} GB`,
      used: `${usedGB.toFixed(2)} GB`,
      free: `${freeGB.toFixed(2)} GB`,
      usagePercent: `${usagePercent.toFixed(2)}%`,
      available: `${(mem.available / 1024 / 1024 / 1024).toFixed(2)} GB`
    };
  } catch (error) {
    throw new Error(`Failed to get memory usage: ${error.message}`);
  }
}

/**
 * List top processes by CPU and memory
 */
export async function listProcesses() {
  try {
    const processes = await si.processes();

    // Sort by CPU and get top 10
    const topCPU = processes.list
      .sort((a, b) => b.cpu - a.cpu)
      .slice(0, 10)
      .map(p => ({
        pid: p.pid,
        name: p.name,
        cpu: p.cpu.toFixed(2) + '%',
        memory: (p.mem).toFixed(2) + '%'
      }));

    // Sort by memory and get top 10
    const topMemory = processes.list
      .sort((a, b) => b.mem - a.mem)
      .slice(0, 10)
      .map(p => ({
        pid: p.pid,
        name: p.name,
        cpu: p.cpu.toFixed(2) + '%',
        memory: (p.mem).toFixed(2) + '%'
      }));

    return {
      topCPU,
      topMemory,
      totalProcesses: processes.all
    };
  } catch (error) {
    throw new Error(`Failed to list processes: ${error.message}`);
  }
}

/**
 * Get disk usage information
 */
export async function getDiskUsage() {
  try {
    const disks = await si.fsSize();

    return disks.map(disk => ({
      filesystem: disk.fs,
      mount: disk.mount,
      type: disk.type,
      size: `${(disk.size / 1024 / 1024 / 1024).toFixed(2)} GB`,
      used: `${(disk.used / 1024 / 1024 / 1024).toFixed(2)} GB`,
      available: `${(disk.available / 1024 / 1024 / 1024).toFixed(2)} GB`,
      usagePercent: `${disk.use.toFixed(2)}%`
    }));
  } catch (error) {
    throw new Error(`Failed to get disk usage: ${error.message}`);
  }
}

/**
 * Get network information
 */
export async function getNetworkInfo() {
  try {
    const interfaces = await si.networkInterfaces();
    const stats = await si.networkStats();

    return {
      interfaces: interfaces.map(iface => ({
        name: iface.iface,
        ip4: iface.ip4,
        ip6: iface.ip6,
        mac: iface.mac,
        internal: iface.internal,
        virtual: iface.virtual
      })),
      stats: stats.map(stat => ({
        interface: stat.iface,
        rxBytes: `${(stat.rx_bytes / 1024 / 1024).toFixed(2)} MB`,
        txBytes: `${(stat.tx_bytes / 1024 / 1024).toFixed(2)} MB`,
        rxSec: `${(stat.rx_sec / 1024).toFixed(2)} KB/s`,
        txSec: `${(stat.tx_sec / 1024).toFixed(2)} KB/s`
      }))
    };
  } catch (error) {
    throw new Error(`Failed to get network info: ${error.message}`);
  }
}

/**
 * Store content in a file
 */
export async function storeInFile(fileName, content) {
  try {
    // Sanitize filename
    const sanitizedName = fileName.replace(/[^a-z0-9.-]/gi, '_');
    
    // Add timestamp if not present
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const finalName = sanitizedName.includes(timestamp) 
      ? sanitizedName 
      : `${path.parse(sanitizedName).name}-${timestamp}${path.parse(sanitizedName).ext || '.txt'}`;

    // Ensure reports directory exists
    const reportsDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(reportsDir, { recursive: true });

    // Write file
    const filePath = path.join(reportsDir, finalName);
    await fs.writeFile(filePath, content, 'utf-8');

    return {
      success: true,
      path: filePath,
      fileName: finalName
    };
  } catch (error) {
    throw new Error(`Failed to store file: ${error.message}`);
  }
}

/**
 * Helper function to format uptime
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ') || '0m';
}